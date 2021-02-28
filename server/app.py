from flask import Flask, redirect, request, send_from_directory, render_template
import requests as rq
import uuid

app = Flask(__name__, template_folder='../webapp/build')


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
        "text": data['text'],
        "message_id": str(uuid.uuid4())
    }
    url = "http://localhost:5005/model/parse"
    result = rq.post(url, json=body).json()
    return result


if __name__ == '__main__':
    app.run()