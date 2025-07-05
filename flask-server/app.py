# ./flask-server/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message
from dotenv import load_dotenv
from os import environ

load_dotenv()
app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['DEBUG'] = environ.get('FLASK_DEBUG')

# Flask-Mail Config
app.config['MAIL_SERVER'] = environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = environ.get('MAIL_USE_TLS', 'true') == 'true'
app.config['MAIL_USERNAME'] = environ.get('MAIL_USERNAME')  # your email
app.config['MAIL_PASSWORD'] = environ.get('MAIL_PASSWORD')  # app password
app.config['MAIL_DEFAULT_SENDER'] = environ.get('MAIL_DEFAULT_SENDER')  # usually same as username

mail = Mail(app)

@app.route('/api/ping')
def ping():
    return jsonify({'message': 'pong'})

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({'error': 'Missing fields'}), 400

    try:
        msg = Message(
            subject=f"Portfolio Contact from {name}",
            sender=app.config['MAIL_DEFAULT_SENDER'],
            recipients=[app.config['MAIL_USERNAME']],
            body=f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"
        )
        mail.send(msg)
        return jsonify({'message': 'Email sent successfully!'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# gunicorn app:app --bind 0.0.0.0:$PORT

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(environ.get("PORT", 5000)))