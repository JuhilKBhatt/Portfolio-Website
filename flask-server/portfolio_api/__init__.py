# ./flask-server/portfolio_api/__init__.py
import logging

from flask import Flask, jsonify

from .config import Config
from .extensions import cache, cors, limiter
from .routes.github import github_bp
from .routes.health import health_bp


def create_app(overrides=None):
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

    app = Flask(__name__)
    app.config.from_object(Config)
    if overrides:
        app.config.update(overrides)

    cache.init_app(app)
    limiter.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})

    app.register_blueprint(health_bp)
    app.register_blueprint(github_bp)

    @app.errorhandler(429)
    def ratelimit_handler(_):
        return jsonify({"error": "Rate limit exceeded. Please slow down and try again later."}), 429

    return app
