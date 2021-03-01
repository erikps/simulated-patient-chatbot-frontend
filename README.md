# Simulated Patient Chatbot Frontend

## Installation

You will need a working installation of node and python to install this project in addition to the rasa project you want to run.

To run this project follow these steps:

1. Setup the venv:
   1. Run `python -m venv venv` to create the venv.
   1. `venv/Scripts/activate` (Windows) or `source venv/bin/activate` (UNIX based systems)
   1. ``pip install -r requirements.txt`
1. Now, run the flask application with
   1. `cd server`
   1. `python app.py`
1. Build the react webpage (In another shell):
   1. Run `cd webapp` and `npm install` to install the frontend dependencies.
   1. `npm start` This starts the development mode for the react app.
1. Run the rasa backend (In another shell):
   1. Navigate to the root folder of your rasa project
   1. Run `rasa run` which starts up the chatbot api.
