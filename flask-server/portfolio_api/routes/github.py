# ./flask-server/portfolio_api/routes/github.py
import logging
import re

import requests
from flask import Blueprint, current_app, jsonify, request

from ..extensions import cache, limiter
from ..services.github import get_user_stats, list_repos_with_portfolio_info

logger = logging.getLogger(__name__)

github_bp = Blueprint("github", __name__, url_prefix="/api/github")

USERNAME_RE = re.compile(r"^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$")


@github_bp.route("/<username>/repos")
@limiter.limit("30 per minute")
@cache.cached(timeout=7200, query_string=True)  # 2-hour cache
def get_repos_with_portfolio_info(username):
    # Validate GitHub username characters to prevent path manipulation
    if not USERNAME_RE.match(username):
        return jsonify({"error": "Invalid username format"}), 400

    # Prevent using server as arbitrary proxy for third-party profiles
    if username.lower() not in current_app.config["ALLOWED_GITHUB_USERS"]:
        logger.warning("Unauthorized GitHub user queried: %s", username)
        return jsonify({"error": "Profile query not permitted"}), 403

    try:
        repos = list_repos_with_portfolio_info(username, current_app.config["GITHUB_TOKEN"])
    except requests.HTTPError as err:
        logger.error("GitHub API error: %s", err, exc_info=True)
        status = err.response.status_code if err.response is not None else 502
        return jsonify({"error": "Failed to retrieve repositories from GitHub."}), status
    except Exception as err:
        logger.error("Internal error fetching repos: %s", err, exc_info=True)
        return jsonify({"error": "An internal error occurred."}), 500

    resp = jsonify(repos)
    # Cloudflare edge caches for 2 hours, browser revalidates after 30 min
    resp.headers["Cache-Control"] = "public, max-age=1800, s-maxage=7200, stale-while-revalidate=1800"
    return resp


@github_bp.route("/<username>/stats")
@github_bp.route("/<username>/metrics")
@limiter.limit("30 per minute")
@cache.cached(timeout=7200, query_string=True)  # 2-hour cache
def get_user_metrics(username):
    # Validate GitHub username characters to prevent path manipulation
    if not USERNAME_RE.match(username):
        return jsonify({"error": "Invalid username format"}), 400

    # Prevent using server as arbitrary proxy for third-party profiles
    if username.lower() not in current_app.config["ALLOWED_GITHUB_USERS"]:
        logger.warning("Unauthorized GitHub user queried for stats: %s", username)
        return jsonify({"error": "Profile query not permitted"}), 403

    try:
        stats = get_user_stats(username, current_app.config["GITHUB_TOKEN"])
    except requests.HTTPError as err:
        logger.error("GitHub API error fetching stats: %s", err, exc_info=True)
        status = err.response.status_code if err.response is not None else 502
        return jsonify({"error": "Failed to retrieve GitHub stats."}), status
    except Exception as err:
        logger.error("Internal error fetching stats: %s", err, exc_info=True)
        return jsonify({"error": "An internal error occurred."}), 500

    resp = jsonify(stats)
    resp.headers["Cache-Control"] = "public, max-age=1800, s-maxage=7200, stale-while-revalidate=1800"
    return resp


@github_bp.route("/<username>/refresh", methods=["GET", "POST"])
@limiter.limit("5 per minute")
def refresh_github_cache(username):
    """Manually invalidate cache on-demand so new repos appear immediately."""
    admin_token = current_app.config["ADMIN_TOKEN"]
    provided = request.headers.get("X-Admin-Token") or request.args.get("token")
    if not admin_token or provided != admin_token:
        logger.warning("Unauthorized cache refresh attempt for %s from IP %s", username, request.remote_addr)
        return jsonify({"error": "Unauthorized"}), 401

    cache.clear()
    logger.info("Cache successfully cleared for %s", username)
    return jsonify({
        "status": "success",
        "message": f"Cache cleared for {username}. Fresh data will be fetched from GitHub on next request.",
    })
