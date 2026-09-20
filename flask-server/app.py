# ./flask-server/app.py
import base64
import json
import requests
import concurrent.futures
from os import environ
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from flask_caching import Cache
from dotenv import load_dotenv

# ────────────────────────────────────────────────────────────────────────────────
load_dotenv()

app = Flask(__name__)

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

# ---------- GitHub helper ----------
GITHUB_TOKEN = environ.get("GITHUB_TOKEN")

def github_request(url, params=None):
    headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    resp = requests.get(url, headers=headers, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json()

# ────────────────────────────────────────────────────────────────────────────────
@app.route("/api/ping")
def ping():
    return jsonify({"message": "pong"})

@app.route("/api/contact", methods=["POST"])
def contact():
    data = request.get_json()
    name, email, message = data.get("name"), data.get("email"), data.get("message")

    if not all([name, email, message]):
        return jsonify({"error": "Missing fields"}), 400

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
        return jsonify({"error": str(e)}), 500

# ────────────────────────────────────────────────────────────────────────────────
@app.route("/api/github/<username>/repos")
@cache.cached(timeout=7200, query_string=True)  # 2‑hour cache (7200 seconds)
def get_repos_with_portfolio_info(username):
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
        return (
            jsonify(
                {"error": f"GitHub API error {err.response.status_code}: {err.response.text}"}
            ),
            err.response.status_code,
        )
    except Exception as err:
        return jsonify({"error": str(err)}), 500

@app.route("/api/github/<username>/refresh", methods=["GET", "POST"])
def refresh_github_cache(username):
    """Manually invalidate cache on-demand so new repos appear immediately."""
    cache.clear()
    return jsonify({
        "status": "success",
        "message": f"Cache cleared for {username}. Fresh data will be fetched from GitHub on next request."
    })

# ────────────────────────────────────────────────────────────────────────────────
# If you deploy with gunicorn:   gunicorn app:app --bind 0.0.0.0:$PORT
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(environ.get("PORT", 5000)))