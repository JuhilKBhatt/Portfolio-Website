# ./flask-server/tests/test_routes.py
import base64
import json

import pytest
import requests

from portfolio_api.services import github


class FakeResponse:
    def __init__(self, payload=None, status=200):
        self._payload = payload
        self.status_code = status

    def json(self):
        return self._payload

    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.HTTPError(response=self)


def _encoded(data):
    return {"encoding": "base64", "content": base64.b64encode(json.dumps(data).encode()).decode()}


@pytest.fixture
def fake_github(monkeypatch):
    """Given a GitHub account with two repos, only one having PortfolioWebsiteInfo.json."""
    def fake_get(url, **_):
        if url.lower().endswith("/users/juhilkbhatt/repos"):
            return FakeResponse([
                {"name": "with-info", "html_url": "https://github.com/a", "description": "A"},
                {"name": "no-info", "html_url": "https://github.com/b", "description": "B"},
            ])
        if "/with-info/contents/" in url:
            return FakeResponse(_encoded({"Priority": 1}))
        return FakeResponse(status=404)

    monkeypatch.setattr(github.requests, "get", fake_get)


def test_ping(client):
    # When pinging, Then pong is returned
    assert client.get("/api/ping").get_json() == {"message": "pong"}


def test_repos_rejects_invalid_username(client):
    # Given a malformed username, When requesting repos, Then 400
    assert client.get("/api/github/bad_name!/repos").status_code == 400


def test_repos_rejects_non_allowlisted_user(client):
    # Given a valid but non-allowlisted user, Then 403
    assert client.get("/api/github/someoneelse/repos").status_code == 403


def test_repos_merges_portfolio_info(client, fake_github):
    # Given repos on GitHub, When requesting repos, Then portfolio_info is attached where present
    resp = client.get("/api/github/JuhilKBhatt/repos")
    assert resp.status_code == 200
    by_name = {r["name"]: r for r in resp.get_json()}
    assert by_name["with-info"]["portfolio_info"] == {"Priority": 1}
    assert by_name["no-info"]["portfolio_info"] is None
    assert "s-maxage=7200" in resp.headers["Cache-Control"]


def test_repos_passes_through_github_error_status(client, monkeypatch):
    # Given GitHub returns 503, Then the same status is returned
    monkeypatch.setattr(github.requests, "get", lambda *a, **k: FakeResponse(status=503))
    assert client.get("/api/github/juhilkbhatt/repos").status_code == 503


def test_refresh_requires_token(client):
    # Given no admin token, Then 401
    assert client.post("/api/github/juhilkbhatt/refresh").status_code == 401


def test_refresh_with_token_succeeds(client):
    # Given the correct admin token header, Then 200
    resp = client.post("/api/github/juhilkbhatt/refresh", headers={"X-Admin-Token": "secret"})
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "success"


def test_rate_limit_returns_json(client):
    # Given 5/min limit on refresh, When exceeded, Then JSON 429
    for _ in range(5):
        client.post("/api/github/juhilkbhatt/refresh")
    resp = client.post("/api/github/juhilkbhatt/refresh")
    assert resp.status_code == 429
    assert "error" in resp.get_json()
