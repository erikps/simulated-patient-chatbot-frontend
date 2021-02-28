# Simulated Patient Chatbot Frontend

## Installation

You will need a working installaton of node and python to install this project aswell in addition to the rasa project you want to run.

To run this project follow these steps:
1. Setup the venv:
    1. ``python -m venv venv`` to create the venv
    2. ``venv/Scripts/activate`` (Windows) or ``source venv/bin/activate`` (UNIX based systems)
1. Now, run the flask application with 
    1. ``cd server``
    2. ``python app.py`` 
1. Build the react webpage (In another shell): 
    1. ``cd webapp`` and ``npm install`` to install the frontend dependencies
    2. ``npm run build``
1. Run the rasa backend (In another shell):
    1. ``rasa run --verbose --enable-api`` 
