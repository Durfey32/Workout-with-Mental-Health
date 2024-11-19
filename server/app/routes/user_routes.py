from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
from app import mongo

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/api/user', methods=['POST'])
def signup():
    name = request.json.get('name')
    username = request.json.get('username', None)
    password = request.json.get('password')

    user_collection = mongo.db.users

    if user_collection.find_one({'username': username}): 
        return jsonify({'message': 'User already exists'})
    
    hashed_password = generate_password_hash(password)
    new_user = {
        'name': name,
        'username': username,
        'password': hashed_password
    }
    user_collection.insert_one(new_user)
    return jsonify({'message': 'User created successfully'}), 201

@user_bp.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password')

    user_collection = mongo.db.users

    user = user_collection.find_one({'username': username})

    if user and check_password_hash(user['password'], password):
        expires = datetime.timedelta(hours=24)
        access_token = create_access_token(identity=str(user['_id']), expires_delta=expires)
        return jsonify({'token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    
@user_bp.route('/api/user', methods=['GET'])
@jwt_required()
def get_users():
    user_collection = mongo.db.users

    all_users = list(user_collection.find())
    return jsonify(all_users)

@user_bp.route('/api/user/<id>', methods=['GET'])
@jwt_required()
def get_user(id):
    user_collection = mongo.db.users

    user = user_collection.find_one({'_id': id})
    return jsonify(user)

@user_bp.route('/api/user/<id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    user_collection = mongo.db.users

    name = request.json.get('name')
    username = request.json.get('username')
    password = request.json.get('password')

    update_fields = {}
    if name:
        update_fields['name'] = name
    if username:
        update_fields['username'] = username
    if password:
        update_fields['password'] = generate_password_hash(password)

    user_collection.update_one({'_id': id}, {'$set': update_fields})
    return jsonify({'message': 'User updated successfully'})

@user_bp.route('/api/user/<id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    user_collection = mongo.db.users

    result = user_collection.delete_one({'_id': id})

    if result.deleted_count == 1:
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404