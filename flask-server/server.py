from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins='*')

@app.route('/ping')
def ping():
    return jsonify({'message': 'pong'})

if __name__ == '__main__':
    app.run(debug=True)