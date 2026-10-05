# ./flask-server/portfolio_api/extensions.py
from flask_caching import Cache
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

cache = Cache()
cors = CORS()
limiter = Limiter(get_remote_address)
