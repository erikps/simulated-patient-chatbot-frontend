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


@app.route('/api/history/<sender_id>', methods=['GET'])
def get_conversation_history(sender_id):
    """ Get the current state / history of the conversation to enable reloading the webpage. """

    url = f'http://localhost:5005/conversations/{sender_id}/tracker'
    events = rq.get(url, json={'conversation_id': sender_id}).json()['events']
    results = []

    for event in events:
        event_type = event['event']
        if event_type == 'user':
            results.append({
                'event': 'user',
                'text': event['text']
            })
        elif event_type == 'bot':
            message = {'event': 'bot', 'text': event['text']}

            data = event['data']
            if data['buttons'] is not None:
                message['buttons'] = data['buttons']
            if data['custom'] is not None and 'score' in data['custom']:
                message['score'] = data['custom']['score']

            results.append(message)

    return {'body': results}


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
