from flask import Blueprint, jsonify, request
from app.models import Meal, meal_schema, meals_schema
from app import mongo
import os
import requests
from bson import ObjectId

meal_bp = Blueprint('meal_bp', __name__)

@meal_bp.route('/api/meal', methods=['GET'])
def get_meals():
    query_params = {
        "maxCalories": request.args.get("calories", ""),
        "minProtein": request.args.get("protein", ""),
        "maxFat": request.args.get("fat", ""),
        "maxCarbs": request.args.get("carbs", ""),
    }

    # Remove empty parameters
    query_params = {k: v for k, v in query_params.items() if v}

    headers = {
        "x-rapidapi-key": os.getenv("X_RAPIDAPI_KEY"),
        "x-rapidapi-host": os.getenv("X_RAPIDAPI_HOST")
    }

    response = requests.get(
        "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByNutrients",
        headers=headers,
        params=query_params,
    )

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"message": "Failed to fetch meals"}), response.status_code
    
from bson import ObjectId

@meal_bp.route('/api/meal/saved', methods=['GET'])
def get_saved_meals():
    try:
        meal_collection = mongo.db.meals
        saved_meals = meal_collection.find()

        # Convert ObjectId to string for the frontend
        sanitized_meals = []
        for meal in saved_meals:
            meal['_id'] = str(meal['_id'])
            sanitized_meals.append(meal)

        return jsonify(sanitized_meals), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching saved meals: {str(e)}"}), 500



@meal_bp.route('/api/meal/<id>', methods=['GET'])
def get_meal(id):
    meal_collection = mongo.db.meals
    meal = meal_collection.find_one({'_id': id})
    return jsonify(meal_schema.dump(meal))

@meal_bp.route('/api/meal', methods=['POST'])
def add_meal():
    try:
        # Retrieve and sanitize data
        name = request.json.get('name')
        type = request.json.get('type', 'Custom')
        calories_raw = request.json.get('calories', '0')
        protein_raw = request.json.get('protein', '0')
        carbs_raw = request.json.get('carbs', '0')
        fat_raw = request.json.get('fat', '0')
        image = request.json.get('image', '')  # Default to empty string if not provided

        # Ensure the values are strings before calling .replace()
        calories = int(str(calories_raw).replace('g', '').strip())
        protein = int(str(protein_raw).replace('g', '').strip())
        carbs = int(str(carbs_raw).replace('g', '').strip())
        fat = int(str(fat_raw).replace('g', '').strip())

        # Validate mandatory fields
        if not name:
            return jsonify({"message": "Name is required"}), 400

        # Create and save meal
        new_meal = Meal(name=name, type=type, calories=calories, protein=protein, carbs=carbs, fat=fat, image=image)
        meal_collection = mongo.db.meals
        meal_collection.insert_one(new_meal.__dict__)

        return jsonify(meal_schema.dump(new_meal)), 201
    except (ValueError, TypeError) as e:
        return jsonify({"message": f"Invalid data format: {str(e)}"}), 400

    
@meal_bp.route('/api/meal/<id>', methods=['DELETE'])
def delete_meal(id):
    """
    Delete a meal from the database by its ID.
    """
    try:
        meal_collection = mongo.db.meals
        result = meal_collection.delete_one({"_id": ObjectId(id)})
        
        if result.deleted_count == 1:
            return jsonify({"message": "Meal deleted successfully."}), 200
        else:
            return jsonify({"message": "Meal not found."}), 404
    except Exception as e:
        return jsonify({"message": f"Error deleting meal: {str(e)}"}), 500


@meal_bp.route('/api/meal/clean', methods=['POST'])
def clean_meals_in_db():
    try:
        meal_collection = mongo.db.meals
        meals = meal_collection.find()

        updated_count = 0
        for meal in meals:
            updated = False
            for field in ['calories', 'protein', 'carbs', 'fat']:
                value = meal.get(field, '0')
                if isinstance(value, str) and not value.isdigit():
                    meal[field] = int(str(value).replace('g', '').strip())
                    updated = True
            if updated:
                meal_collection.update_one({'_id': meal['_id']}, {'$set': meal})
                updated_count += 1

        return jsonify({"message": f"Database cleaned successfully. {updated_count} records updated."}), 200
    except Exception as e:
        return jsonify({"message": f"Error during database cleaning: {str(e)}"}), 500

