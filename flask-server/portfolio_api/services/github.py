# ./flask-server/portfolio_api/services/github.py
"""GitHub API access: no Flask request/response handling here."""
import base64
import concurrent.futures
import json

import requests

API = "https://api.github.com"


def github_request(url, token=None, params=None):
    headers = {"Accept": "application/vnd.github+json"}
    if token:
        headers["Authorization"] = f"token {token}"
    resp = requests.get(url, headers=headers, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json()


def fetch_portfolio_info(username, repo_name, token=None):
    """Return parsed PortfolioWebsiteInfo.json from the repo's main branch, or None if absent."""
    try:
        file_resp = github_request(
            f"{API}/repos/{username}/{repo_name}/contents/PortfolioWebsiteInfo.json",
            token,
            params={"ref": "main"},
        )
    except requests.HTTPError as e:
        if e.response.status_code == 404:
            return None
        raise

    if file_resp.get("encoding") != "base64":
        return None
    raw = base64.b64decode(file_resp["content"]).decode("utf-8")
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"error": "Invalid JSON", "raw": raw}


def list_repos_with_portfolio_info(username, token=None):
    repos = github_request(f"{API}/users/{username}/repos", token, params={"per_page": 100, "sort": "updated"})

    enriched = [
        {
            "id": r.get("id"),
            "name": r["name"],
            "html_url": r["html_url"],
            "description": r["description"],
            "portfolio_info": None,
        }
        for r in repos
    ]

    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(fetch_portfolio_info, username, r["name"], token): r for r in enriched}
        for future in concurrent.futures.as_completed(futures):
            try:
                futures[future]["portfolio_info"] = future.result()
            except Exception:
                pass  # One broken repo shouldn't break the whole list

    return enriched


def get_user_stats(username, token=None):
    """
    Fetch user metrics:
    - total_projects (public repos count)
    - total_commits (commits authored by user)
    - community_contributions / community_commits (commits authored by user in external repos)
    """
    def fetch_user():
        return github_request(f"{API}/users/{username}", token)

    def fetch_commits():
        return github_request(f"{API}/search/commits", token, params={"q": f"author:{username}"})

    def fetch_community_commits():
        return github_request(f"{API}/search/commits", token, params={"q": f"author:{username} -user:{username}"})

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        user_future = executor.submit(fetch_user)
        commits_future = executor.submit(fetch_commits)
        community_future = executor.submit(fetch_community_commits)

        user_data = user_future.result()
        commits_data = commits_future.result()
        community_data = community_future.result()

    total_projects = user_data.get("public_repos", 0)
    total_commits = commits_data.get("total_count", 0)
    community_commits = community_data.get("total_count", 0)

    return {
        "total_projects": total_projects,
        "total_commits": total_commits,
        "community_contributions": community_commits,
        "community_commits": community_commits,
    }
