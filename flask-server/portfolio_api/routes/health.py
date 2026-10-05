# ./flask-server/portfolio_api/routes/health.py
from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__, url_prefix="/api")


@health_bp.route("/ping")
def ping():
    return jsonify({"message": "pong"})
