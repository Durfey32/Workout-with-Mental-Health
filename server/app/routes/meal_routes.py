from flask import Blueprint, jsonify, request
from app.models import Meal, meal_schema, meals_schema
from app import mongo
import os
import requests

meal_bp = Blueprint('meal_bp', __name__)

@meal_bp.route('/api/meal', methods=['GET'])
def get_meals():
    app_key = os.getenv('edamam-api-key')
    app_id = os.getenv('edamam-app-id')
    # meal = request.args.get('brisket', 'fries')
    api_url = 'https://api.edamam.com/api/food-database/v2/select'
    params = {
  "size": 7,
  "plan": {
    "accept": {
      "all": [
        {
          "health": [
            "SOY_FREE",
            "FISH_FREE",
            "MEDITERRANEAN"
          ]
        }
      ]
    },
    "fit": {
      "ENERC_KCAL": {
        "min": 1000,
        "max": 2000
      },
      "SUGAR.added": {
        "max": 20
      }
    },
    "exclude": [
      "http://www.edamam.com/ontologies/edamam.owl#recipe_x",
      "http://www.edamam.com/ontologies/edamam.owl#recipe_y",
      "http://www.edamam.com/ontologies/edamam.owl#recipe_z"
    ],
    "sections": {
      "Breakfast": {
        "accept": {
          "all": [
            {
              "dish": [
                "drinks",
                "egg",
                "biscuits and cookies",
                "bread",
                "pancake",
                "cereals"
              ]
            },
            {
              "meal": [
                "breakfast"
              ]
            }
          ]
        },
        "fit": {
          "ENERC_KCAL": {
            "min": 100,
            "max": 600
          }
        }
      },
      "Lunch": {
        "accept": {
          "all": [
            {
              "dish": [
                "main course",
                "pasta",
                "egg",
                "salad",
                "soup",
                "sandwiches",
                "pizza",
                "seafood"
              ]
            },
            {
              "meal": [
                "lunch/dinner"
              ]
            }
          ]
        },
        "fit": {
          "ENERC_KCAL": {
            "min": 300,
            "max": 900
          }
        }
      },
      "Dinner": {
        "accept": {
          "all": [
            {
              "dish": [
                "seafood",
                "egg",
                "salad",
                "pizza",
                "pasta",
                "main course"
              ]
            },
            {
              "meal": [
                "lunch/dinner"
              ]
            }
          ]
        },
        "fit": {
          "ENERC_KCAL": {
            "min": 200,
            "max": 900
          }
        }
      }
    }
  }
 }
    response = requests.post(api_url, json=params, params={'app_key': app_key, 'app_id': app_id}, headers={'Content-Type': 'application/json'})
    
    if response.status_code == requests.codes.ok:
        return jsonify(response.json())
    else:
        return jsonify({"error": response.status_code, "message": response.text}), response.status_code

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