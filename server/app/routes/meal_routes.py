from flask import Blueprint, jsonify, request
from app.models import Meal, meal_schema, meals_schema
from app import mongo

meal_bp = Blueprint('meal_bp', __name__)

@meal_bp.route('/api/meal', methods=['GET'])
def get_meals():
    meal_collection = mongo.db.meals
    meals = list(meal_collection.find())
    return jsonify(meals_schema.dump(meals))

@meal_bp.route('/api/meal/<id>', methods=['GET'])
def get_meal(id):
    meal_collection = mongo.db.meals
    meal = meal_collection.find_one({'_id': id})
    return jsonify(meal_schema.dump(meal))

@meal_bp.route('/api/meal', methods=['POST'])
def add_meal():
    name = request.json['name']
    ingredients = request.json['ingredients']
    calories = request.json['calories']
    instructions = request.json['instructions']

    new_meal = Meal(name, ingredients, calories, instructions)
    meal_collection = mongo.db.meals
    meal_collection.insert_one(new_meal.__dict__)

    return jsonify(meal_schema.dump(new_meal))

@meal_bp.route('/api/meal/<id>', methods=['PUT'])
def update_meal(id):
    meal_collection = mongo.db.meals
    meal = meal_collection.find_one({'_id': id})

    meal['name'] = request.json['name']
    meal['ingredients'] = request.json['ingredients']
    meal['calories'] = request.json['calories']
    meal['instructions'] = request.json['instructions']

    meal_collection.save(meal)
    return jsonify(meal_schema.dump(meal))

@meal_bp.route('/api/meal/<id>', methods=['DELETE'])
def delete_meal(id):
    meal_collection = mongo.db.meals
    meal = meal_collection.find_one({'_id': id})

    meal_collection.remove(meal)
    return jsonify({'message': 'Meal deleted successfully'})