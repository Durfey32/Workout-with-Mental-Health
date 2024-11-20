from flask import Blueprint, jsonify, request
from app.models import Workout, workout_schema, workouts_schema
from app import mongo
import os
import requests

workout_bp = Blueprint('workout_bp', __name__)

@workout_bp.route('/api/workout', methods=['GET'])
def get_workouts():
    muscle = request.args.get('muscle', 'biceps')
    api_url = 'https://api.api-ninjas.com/v1/exercises?muscle={}'.format(muscle)
    api_key = os.getenv('X-API-KEY')
    response = requests.get(api_url, headers={'X-Api-Key': api_key})
    
    if response.status_code == requests.codes.ok:
        return jsonify(response.json())
    else:
        return jsonify({"error": response.status_code, "message": response.text}), response.status_code

@workout_bp.route('/api/workout/<id>', methods=['GET'])
def get_workout(id):
    workout_collection = mongo.db.workouts
    workout = workout_collection.find_one({'_id': id})
    return jsonify(workout_schema.dump(workout))

@workout_bp.route('/api/workout', methods=['POST'])
def add_workout():
    name = request.json['name']
    type = request.json['type']
    muscle = request.json['muscle']
    equipment = request.json['equipment']
    difficulty = request.json['difficulty']
    instructions = request.json['instructions']

    new_workout = Workout(name, type, muscle, equipment, difficulty, instructions)
    workout_collection = mongo.db.workouts
    workout_collection.insert_one(new_workout.__dict__)

    return jsonify(workout_schema.dump(new_workout))

@workout_bp.route('/api/workout/<id>', methods=['PUT'])
def update_workout(id):
    workout_collection = mongo.db.workouts
    workout = workout_collection.find_one({'_id': id})

    workout['name'] = request.json['name']
    workout['type'] = request.json['type']
    workout['muscle'] = request.json['muscle']
    workout['equipment'] = request.json['equipment']
    workout['difficulty'] = request.json['difficulty']
    workout['instructions'] = request.json['instructions']

    workout_collection.save(workout)
    return jsonify(workout_schema.dump(workout))

@workout_bp.route('/api/workout/<id>', methods=['DELETE'])
def delete_workout(id):
    workout_collection = mongo.db.workouts
    workout = workout_collection.find_one({'_id': id})

    workout_collection.remove(workout)
    return jsonify({'message': 'Workout deleted successfully'})