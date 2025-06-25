from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from os import environ

load_dotenv()
app = Flask(__name__)
cors = CORS(app, origins='*')

app.config['DEBUG'] = environ.get('FLASK_DEBUG')

@app.route('/ping')
def ping():
    return jsonify({'message': 'pong'})

if __name__ == '__main__':
    app.run()