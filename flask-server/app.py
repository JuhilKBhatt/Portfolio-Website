# ./flask-server/app.py
import base64
import json
import logging
import re
import requests
import concurrent.futures
from os import environ
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_caching import Cache
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dotenv import load_dotenv

# ────────────────────────────────────────────────────────────────────────────────
load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Rate limiting (in-memory, lightweight and secure)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["300 per day", "100 per hour"],
    storage_uri="memory://",
)

# Restrict CORS to specified origins via environment variable
cors_origins = environ.get("CORS_ORIGINS", "*").split(",")
CORS(app, resources={r"/api/*": {"origins": cors_origins}})

app.config["DEBUG"] = environ.get("FLASK_DEBUG", "0") == "1"

# ---------- Flask‑Mail ----------
app.config["MAIL_SERVER"] = environ.get("MAIL_SERVER", "smtp.gmail.com")
app.config["MAIL_PORT"] = int(environ.get("MAIL_PORT", 587))
app.config["MAIL_USE_TLS"] = environ.get("MAIL_USE_TLS", "true") == "true"
app.config["MAIL_USERNAME"] = environ.get("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = environ.get("MAIL_PASSWORD")
app.config["MAIL_DEFAULT_SENDER"] = environ.get("MAIL_DEFAULT_SENDER")

mail = Mail(app)

# ---------- Cache (2 hours to balance freshness with low bandwidth usage) ----------
cache = Cache(app, config={"CACHE_TYPE": "SimpleCache", "CACHE_DEFAULT_TIMEOUT": 7200})

# ---------- GitHub configuration & helpers ----------
GITHUB_TOKEN = environ.get("GITHUB_TOKEN")
ALLOWED_GITHUB_USERS = set(
    user.strip().lower() for user in environ.get("ALLOWED_GITHUB_USERS", "JuhilKBhatt").split(",") if user.strip()
)
ADMIN_TOKEN = environ.get("ADMIN_TOKEN")

def github_request(url, params=None):
    headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    resp = requests.get(url, headers=headers, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json()

# ────────────────────────────────────────────────────────────────────────────────
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Rate limit exceeded. Please slow down and try again later."}), 429

@app.route("/api/ping")
def ping():
    return jsonify({"message": "pong"})

@app.route("/api/contact", methods=["POST"])
@limiter.limit("5 per hour")
def contact():
    data = request.get_json(silent=True) or {}
    raw_name = data.get("name")
    raw_email = data.get("email")
    raw_message = data.get("message")

    if not (raw_name and raw_email and raw_message):
        return jsonify({"error": "Missing required fields"}), 400

    # Sanitize and cap length to prevent SMTP header injection and memory exhaustion
    name = re.sub(r"[\r\n]+", " ", str(raw_name)).strip()[:100]
    email = re.sub(r"[\r\n]+", "", str(raw_email)).strip()[:120]
    message = str(raw_message).strip()[:5000]

    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return jsonify({"error": "Invalid email address format"}), 400

    try:
        msg = Message(
            subject=f"Portfolio Contact from {name}",
            sender=app.config["MAIL_DEFAULT_SENDER"],
            recipients=[app.config["MAIL_USERNAME"]],
            body=f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}",
        )
        mail.send(msg)
        return jsonify({"message": "Email sent successfully!"})
    except Exception as e:
        logger.error("Failed to send contact email: %s", e, exc_info=True)
        return jsonify({"error": "Unable to send email at this time. Please try again later."}), 500

# ────────────────────────────────────────────────────────────────────────────────
@app.route("/api/github/<username>/repos")
@limiter.limit("30 per minute")
@cache.cached(timeout=7200, query_string=True)  # 2‑hour cache (7200 seconds)
def get_repos_with_portfolio_info(username):
    # Validate GitHub username characters to prevent path manipulation
    if not re.match(r"^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$", username):
        return jsonify({"error": "Invalid username format"}), 400

    # Prevent using server as arbitrary proxy for third-party profiles
    if username.lower() not in ALLOWED_GITHUB_USERS:
        logger.warning("Unauthorized GitHub user queried: %s", username)
        return jsonify({"error": "Profile query not permitted"}), 403

    try:
        repos = github_request(
            f"https://api.github.com/users/{username}/repos",
            params={"per_page": 100, "sort": "updated"},
        )

        def fetch_portfolio_info(repo_name):
            try:
                file_resp = github_request(
                    f"https://api.github.com/repos/{username}/{repo_name}/contents/PortfolioWebsiteInfo.json",
                    params={"ref": "main"},
                )
                if file_resp.get("encoding") == "base64":
                    raw = base64.b64decode(file_resp["content"]).decode("utf-8")
                    try:
                        return json.loads(raw)
                    except Exception:
                        return {"error": "Invalid JSON", "raw": raw}
            except requests.HTTPError as e:
                if e.response.status_code != 404:
                    raise
            return None

        enriched = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            future_to_repo = {}
            for repo in repos:
                repo_data = {
                    "name": repo["name"],
                    "html_url": repo["html_url"],
                    "description": repo["description"],
                    "portfolio_info": None,
                }
                enriched.append(repo_data)
                future = executor.submit(fetch_portfolio_info, repo["name"])
                future_to_repo[future] = repo_data

            for future in concurrent.futures.as_completed(future_to_repo):
                repo_data = future_to_repo[future]
                try:
                    repo_data["portfolio_info"] = future.result()
                except Exception:
                    pass

        resp = jsonify(enriched)
        # Cloudflare edge caches for 2 hours (7200s), browser revalidates after 30 min
        resp.headers["Cache-Control"] = "public, max-age=1800, s-maxage=7200, stale-while-revalidate=1800"
        return resp

    except requests.HTTPError as err:
        logger.error("GitHub API error: %s", err, exc_info=True)
        status = err.response.status_code if err.response is not None else 502
        return jsonify({"error": "Failed to retrieve repositories from GitHub."}), status
    except Exception as err:
        logger.error("Internal error fetching repos: %s", err, exc_info=True)
        return jsonify({"error": "An internal error occurred."}), 500

@app.route("/api/github/<username>/refresh", methods=["GET", "POST"])
@limiter.limit("5 per minute")
def refresh_github_cache(username):
    """Manually invalidate cache on-demand so new repos appear immediately."""
    provided_token = request.headers.get("X-Admin-Token") or request.args.get("token")
    if not ADMIN_TOKEN or provided_token != ADMIN_TOKEN:
        logger.warning("Unauthorized cache refresh attempt for %s from IP %s", username, request.remote_addr)
        return jsonify({"error": "Unauthorized"}), 401

    cache.clear()
    logger.info("Cache successfully cleared for %s", username)
    return jsonify({
        "status": "success",
        "message": f"Cache cleared for {username}. Fresh data will be fetched from GitHub on next request."
    })

# ────────────────────────────────────────────────────────────────────────────────
# If you deploy with gunicorn:   gunicorn app:app --bind 0.0.0.0:$PORT
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(environ.get("PORT", 5001)))