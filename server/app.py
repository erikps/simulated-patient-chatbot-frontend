from flask import Flask, redirect, request, send_from_directory, render_template
from flask_cors import CORS
import requests as rq
import uuid

app = Flask(__name__, template_folder='../webapp/build')
CORS(app)


@app.route('/')
def index():
    return redirect('app')


@app.route('/app')
def serve_webapp():
    return render_template('index.html')


@app.route('/app/<path:path>')
def serve_static(path):
    return send_from_directory('../webapp/build', path)


@app.route("/api/", methods=['POST'])
def post_attempt():
    data = request.get_json()
    body = {
        "sender": data['sender'],
        "message": data['message']
    }
    url = "http://localhost:5005/webhooks/rest/webhook"
    result = rq.post(url, json=body).json()

    return {'body': result}


if __name__ == '__main__':
    app.run()
