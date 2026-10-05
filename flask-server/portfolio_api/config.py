# ./flask-server/portfolio_api/config.py
from os import environ

from dotenv import load_dotenv

load_dotenv()


def _csv(name, default=""):
    return [v.strip() for v in environ.get(name, default).split(",") if v.strip()]


class Config:
    DEBUG = environ.get("FLASK_DEBUG", "0") == "1"

    # CORS
    CORS_ORIGINS = _csv("CORS_ORIGINS", "*")

    # Cache (2 hours to balance freshness with low bandwidth usage)
    CACHE_TYPE = "SimpleCache"
    CACHE_DEFAULT_TIMEOUT = 7200

    # Rate limiting (in-memory, lightweight and secure)
    RATELIMIT_DEFAULT = "300 per day;100 per hour"
    RATELIMIT_STORAGE_URI = "memory://"

    # GitHub
    GITHUB_TOKEN = environ.get("GITHUB_TOKEN")
    ALLOWED_GITHUB_USERS = {u.lower() for u in _csv("ALLOWED_GITHUB_USERS", "JuhilKBhatt")}

    # Admin
    ADMIN_TOKEN = environ.get("ADMIN_TOKEN")
