from flask import Flask, redirect, request, send_from_directory, render_template
from flask_cors import CORS
import requests as rq
import uuid
import os

app = Flask(__name__, template_folder='static')
CORS(app)


@app.route('/')
def index():
    return redirect('app')


@app.route('/app')
def serve_webapp():
    return render_template('index.html')


@app.route('/api/history/', methods=['GET'])
def get_conversation_history():
    """ Get the current state / history of the conversation to enable reloading the webpage. """
    sender_id = request.get_json()['sender']

    url = f'http://localhost:5005/conversations/{sender_id}/tracker'
    result = rq.get(url)
    print(result)


@app.route('/api/', methods=['POST'])
def post_message():
    """ Post a new message and get response from webserver. """
    data = request.get_json()

    body = {
        'sender': data['sender'],
        'message': data['message']
    }
    url = 'http://localhost:5005/webhooks/rest/webhook'
    result = rq.post(url, json=body).json()

    print(result)

    return {'body': result}


if __name__ == '__main__':
    app.run()
