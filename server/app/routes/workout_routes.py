from flask import Blueprint, jsonify, request
from app.models import Workout, workout_schema, workouts_schema
from app import mongo
import os
import requests
from bson import ObjectId
from bson.errors import InvalidId

workout_bp = Blueprint('workout_bp', __name__)
@workout_bp.route('/api/workout', methods=['GET'])
def get_workouts():
    muscle = request.args.get('muscle', 'biceps')
    exercise_type = request.args.get('type')
    difficulty = request.args.get('difficulty')

    api_url = 'https://api.api-ninjas.com/v1/exercises?muscle={}'.format(muscle)
    if exercise_type:
        api_url += f"&type={exercise_type}"
    if difficulty:
        api_url += f"&difficulty={difficulty}"

    api_key = os.environ.get('X-API-KEY')
    print(os.getenv('X-API-KEY'))
    response = requests.get(api_url, headers={'X-API-KEY': api_key})

    
    if response.status_code == requests.codes.ok:
        return jsonify(response.json())
    else:
        return jsonify({"error": response.status_code, "message": response.text}), response.status_code


@workout_bp.route('/api/workout/saved', methods=['GET'])
def get_saved_workouts():
    workout_collection = mongo.db.workouts
    saved_workouts = list(workout_collection.find())
    for workout in saved_workouts:
        workout['_id'] = str(workout['_id'])
    return jsonify(saved_workouts)

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
    try:
        workout_collection = mongo.db.workouts
        result = workout_collection.delete_one({'_id': ObjectId(id)})
        if result.deleted_count == 0:
            return jsonify({"message": "Workout not found"}), 404
        return jsonify({"message": "Workout deleted successfully"}), 200
    except InvalidId:
        return jsonify({"message": f"Invalid ObjectId: {id}"}), 400
