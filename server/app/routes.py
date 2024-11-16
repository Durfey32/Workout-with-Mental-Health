from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import random
import json
import os

user_bp = Blueprint('user_bp', __name__)
quotes_bp = Blueprint('quotes_bp', __name__)

base_dir = os.path.abspath(os.path.dirname(__file__))
quotes_file_path = os.path.join(base_dir, 'Resources', 'quotes.csv')

with open(quotes_file_path, 'r', encoding='utf-8') as file:
    quotes = json.load(file)

@quotes_bp.route('/quotes', methods=['GET'])
def generate_random_quote():
    quote = random.choice(quotes)
    return jsonify(quote)

@user_bp.route('/user', methods=['POST'])
def signup():
    name = request.json.get('name')
    userName = request.json.get('userName', None)
    password = request.json.get('password')

    user_collection = current_app.config['MONGO_URI'].db.users

    if user_collection.find_one({'userName': userName}): 
        return jsonify({'message': 'User already exists'})
    
    hashed_password = generate_password_hash(password)
    new_user = {
        'name': name,
        'userName': userName,
        'password': hashed_password
    }
    user_collection.insert_one(new_user)
    return jsonify({'message': 'User created successfully'}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    userName = request.json.get('userName', None) 
    password = request.json.get('password')

    user_collection = current_app.config['MONGO_URI'].db.users

    user = user_collection.find_one({'userName': userName})

    if user and check_password_hash(user['password'], password):
        expires = datetime.timedelta(hours=24)
        access_token = create_access_token(identity=str(user['_id']), expires_delta=expires)
        return jsonify({'token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    
@user_bp.route('/user', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user_collection = current_app.config['MONGO_URI'].db.users

    user = user_collection.find_one({'_id': current_user_id})
    return jsonify(logged_in_as=user), 200

@user_bp.route('/user', methods=['GET'])
def get_users():
    user_collection = current_app.config['MONGO_URI'].db.users

    all_users = list(user_collection.find())
    return jsonify(all_users)

@user_bp.route('/user/<id>', methods=['GET'])
def get_user(id):
    user_collection = current_app.config['MONGO_URI'].db.users

    user = user_collection.find_one({'_id': id})
    return jsonify(user)

@user_bp.route('/user/<id>', methods=['PUT'])
def update_user(id):
    user_collection = current_app.config['MONGO_URI'].db.users

    name = request.json.get('name')
    userName = request.json.get('userName')
    password = request.json.get('password')

    update_fields = {}
    if name:
        update_fields['name'] = name
    if userName:
        update_fields['userName'] = userName
    if password:
        update_fields['password'] = generate_password_hash(password)

    user_collection.update_one({'_id': id}, {'$set': update_fields})
    return jsonify({'message': 'User updated successfully'})

@user_bp.route('/user/<id>', methods=['DELETE'])
def delete_user(id):
    user_collection = current_app.config['MONGO_URI'].db.users

    result = user_collection.delete_one({'_id': id})

    if result.deleted_count == 1:
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404