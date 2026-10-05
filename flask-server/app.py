# ./flask-server/app.py
# Entrypoint kept as `app:app` so Gunicorn/Docker commands stay unchanged.
from os import environ

from portfolio_api import create_app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(environ.get("PORT", 5001)))