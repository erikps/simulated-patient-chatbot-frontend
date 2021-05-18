from logging import warn
from flask import Flask, redirect, request, send_from_directory, render_template, Response
from flask_cors import CORS
import requests as rq
import uuid
import os


app = Flask(__name__, template_folder='static')
CORS(app)

RASA_ENDPOINT = 'http://localhost:5005/'


@app.route('/health')
def health():
    return Response(status=200)


def fetch_conversation_tracker(sender_id):
    url = f'{RASA_ENDPOINT}conversations/{sender_id}/tracker'
    return rq.get(url, json={'conversation_id': sender_id}).json()


@app.route('/api/report/<sender_id>/<timestamp>', methods=['POST'])
def post_report(sender_id, timestamp):

    try:
        tracker = fetch_conversation_tracker(sender_id)

    except Exception as e:
        return Response(status=404)

    reports = set()

    if 'slots' in tracker and 'reports' in tracker['slots'] and tracker['slots']['reports']:
        reports = set(tracker['slots']['reports'])

    if timestamp in reports:
        # Check if the message was already reported.
        # If so, return instantly
        return Response(status=200)

    reports.add(timestamp)

    res = rq.post(f'{RASA_ENDPOINT}conversations/{sender_id}/tracker/events', json={
        'event': 'slot',
        'name': 'reports',
        'value': list(reports)
    })

    if not res.ok:
        return Response(status=400)

    return Response(status=200)


@app.route('/api/history/<sender_id>', methods=['GET'])
def get_conversation_history(sender_id):
    """ Get the current state / history of the conversation to enable reloading the webpage. """

    try:
        events = fetch_conversation_tracker(sender_id)['events']
    except Exception as e:
        # Catches errors when conversation id does not exist or the backend server does not currently run.
        return Response(status=404)

    results = []

    for event in events:
        event_type = event['event']
        if event_type == 'user':
            results.append({
                'event': 'user',
                'text': event['text']
            })
        elif event_type == 'bot':
            message = {'event': 'bot',
                       'text': event['text'], 'timestamp': event['timestamp']}

            data = event['data']
            if data['buttons'] is not None:
                message['buttons'] = data['buttons']
            if data['custom'] is not None and 'score' in data['custom']:
                message['score'] = data['custom']['score']

            results.append(message)

    return {'body': results}


if __name__ == '__main__':
    app.run()
