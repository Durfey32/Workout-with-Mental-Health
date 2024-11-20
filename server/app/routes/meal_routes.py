from flask import Blueprint, jsonify, request
from app.models import Meal, meal_schema, meals_schema
from app import mongo
import os
import requests

meal_bp = Blueprint('meal_bp', __name__)

@meal_bp.route('/api/meal', methods=['GET'])
def get_meals():
    x_rapidapi_key = os.getenv('X_RAPIDAPI_KEY')
    x_rapidapi_host = os.getenv('X_RAPIDAPI_HOST')
    url = "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByNutrients"
    querystring = {"minProtein":"15","maxCalories":"450"}
    headers = {
        "x-rapidapi-key": x_rapidapi_key,
        "x-rapidapi-host": x_rapidapi_host
    }
    response = requests.get(url, headers=headers, params=querystring)
    print(f"API Key: {x_rapidapi_key}, Host: {x_rapidapi_host}")
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'message': 'Failed to fetch meals'}), response.status_code

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