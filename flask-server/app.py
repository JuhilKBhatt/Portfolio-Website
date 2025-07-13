# ./flask-server/app.py

#https://api.github.com/users/juhilkbhatt/repos

import base64
import requests
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from dotenv import load_dotenv
from os import environ

load_dotenv()
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['DEBUG'] = environ.get('FLASK_DEBUG')

# Flask-Mail Config
app.config['MAIL_SERVER'] = environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = environ.get('MAIL_USE_TLS', 'true') == 'true'
app.config['MAIL_USERNAME'] = environ.get('MAIL_USERNAME')  # your email
app.config['MAIL_PASSWORD'] = environ.get('MAIL_PASSWORD')  # app password
app.config['MAIL_DEFAULT_SENDER'] = environ.get('MAIL_DEFAULT_SENDER')  # usually same as username

mail = Mail(app)

@app.route('/api/ping')
def ping():
    return jsonify({'message': 'pong'})

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({'error': 'Missing fields'}), 400

    try:
        msg = Message(
            subject=f"Portfolio Contact from {name}",
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=[app.config['MAIL_USERNAME']],
            body=f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
        )
        mail.send(msg)
        return jsonify({'message': 'Email sent successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# GitHub helper
GITHUB_TOKEN = environ.get("GITHUB_TOKEN")

def github_request(url, params=None):
    """Wrapper that adds auth header if GITHUB_TOKEN exists."""
    headers = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    resp = requests.get(url, headers=headers, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json()

@app.route("/api/github/<username>/repos")
def get_repos_with_portfolio_info(username):
    try:
        # 1. Get all public repos (first 100 for now)
        repos = github_request(
            f"https://api.github.com/users/{username}/repos",
            params={"per_page": 100, "sort": "updated"}
        )

        enriched_repos = []

        for repo in repos:
            repo_data = {
                "name": repo["name"],
                "html_url": repo["html_url"],
                "description": repo["description"],
                "portfolio_info": None
            }

            try:
                file_resp = github_request(
                    f"https://api.github.com/repos/{username}/{repo['name']}/contents/PortfolioWebsiteInfo.json",
                    params={"ref": "main"}
                )

                if file_resp.get("encoding") == "base64":
                    content = base64.b64decode(file_resp["content"]).decode("utf-8")
                    try:
                        repo_data["portfolio_info"] = json.loads(content)
                    except Exception:
                        repo_data["portfolio_info"] = {
                            "error": "Invalid JSON",
                            "raw": content
                        }

            except requests.HTTPError as e:
                if e.response.status_code != 404:
                    raise

            enriched_repos.append(repo_data)

        return jsonify(enriched_repos)

    except requests.HTTPError as err:
        return jsonify({"error": f"GitHub API error {err.response.status_code}: {err.response.text}"}), err.response.status_code
    except Exception as err:
        return jsonify({"error": str(err)}), 500

# gunicorn app:app --bind 0.0.0.0:$PORT

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(environ.get("PORT", 5000)))