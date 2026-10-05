# ./flask-server/tests/conftest.py
import pytest

from portfolio_api import create_app


@pytest.fixture
def app():
    return create_app({
        "TESTING": True,
        "ADMIN_TOKEN": "secret",
        "ALLOWED_GITHUB_USERS": {"juhilkbhatt"},
        "GITHUB_TOKEN": None,
        "CACHE_TYPE": "NullCache",
    })


@pytest.fixture
def client(app):
    return app.test_client()
