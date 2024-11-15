from flask import request, jsonify
from app import app
from . import db
from app.models import Workout
from app.schemas import workout_schema

import requests

@app.route('/workout', methods=['POST'])
def add_workout():
    name = request.json['name']
    type = request.json['type']
    muscle = request.json['muscle']
    equipment = request.json['equipment']
    difficulty = request.json['difficulty']
    instructions = request.json['instructions']
    new_workout = Workout(name=name, type=type, muscle=muscle, equipment=equipment, difficulty=difficulty, instructions=instructions)
    db.session.add(new_workout)
    db.session.commit()
    return workout_schema.jsonify(new_workout)

@app.route('/exercises', methods=['GET'])
def get_exercises():
    muscle = request.args.get('muscle')
    api_url = 'https://api.api-ninjas.com/v1/exercises?muscle={}'.format(muscle)
    response = requests.get(api_url, headers={'X-Api-Key': 'YOUR_API_KEY'})
    
    if response.status_code == requests.codes.ok:
        return jsonify(response.json())
    else:
        return jsonify({"error": response.status_code, "message": response.text}), response.status_code