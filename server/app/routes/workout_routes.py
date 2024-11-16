from flask import Blueprint, jsonify, current_app, request
from app.models import Workout, workout_schema, workouts_schema
import os

workout_bp = Blueprint('workout_bp', __name__)

base_dir = os.path.abspath(os.path.dirname(__file__))

@workout_bp.route('/workout', methods=['GET'])
def get_workouts():
    workout_collection = current_app.config['MONGO_URI'].db.workouts

    workouts = list(workout_collection.find())
    return jsonify(workouts)

@workout_bp.route('/workout/<id>', methods=['GET'])
def get_workout(id):
    workout_collection = current_app.config['MONGO_URI'].db.workouts

    workout = workout_collection.find_one({'_id': id})
    return jsonify(workout)

@workout_bp.route('/workout', methods=['POST'])
def add_workout():
    name = request.json['name']
    type = request.json['type']
    muscle = request.json['muscle']
    equipment = request.json['equipment']
    difficulty = request.json['difficulty']
    instructions = request.json['instructions']

    new_workout = Workout(name, type, muscle, equipment, difficulty, instructions)
    mongo = current_app.config['MONGO_URI']
    workout_collection = mongo.db.workouts
    workout_collection.insert_one(new_workout.__dict__)

    return workout_schema.jsonify(new_workout)

@workout_bp.route('/workout/<id>', methods=['PUT'])
def update_workout(id):
    workout_collection = current_app.config['MONGO_URI'].db.workouts

    workout = workout_collection.find_one({'_id': id})

    workout['name'] = request.json['name']
    workout['type'] = request.json['type']
    workout['muscle'] = request.json['muscle']
    workout['equipment'] = request.json['equipment']
    workout['difficulty'] = request.json['difficulty']
    workout['instructions'] = request.json['instructions']

    workout_collection.save(workout)
    return jsonify(workout)

@workout_bp.route('/workout/<id>', methods=['DELETE'])
def delete_workout(id):
    workout_collection = current_app.config['MONGO_URI'].db.workouts

    workout = workout_collection.find_one({'_id': id})

    workout_collection.remove(workout)
    return jsonify({'message': 'Workout deleted successfully'})