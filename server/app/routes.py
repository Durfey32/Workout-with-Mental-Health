from flask import Blueprint, request, jsonify
from .models import User
from . import db, ma
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import random
import json
import os

user_bp = Blueprint('user_bp', __name__)
quotes_bp = Blueprint('quotes_bp', __name__)

base_dir = os.path.abspath(os.path.dirname(__file__))

quotes_file_path = os.path.join(os.path.dirname(__file__), 'Resources', 'quotes.csv')
if not os.path.exists(quotes_file_path):
    quotes_file_path = os.path.join(os.path.dirname(__file__), 'Resources', 'quotes.json')

with open(quotes_file_path, 'r', encoding='utf-8') as file:
    quotes = json.load(file)

@quotes_bp.route('/quotes', methods=['GET'])
def generate_random_quote():
    quote = random.choice(quotes)
    return jsonify(quote)

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'password', 'created_at')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

@user_bp.route('/user', methods=['POST'])
def signup():
    name = request.json.get('name')
    email = request.json.get('email', None)
    password = request.json.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'})
    
    hashed_password = generate_password_hash(password)
    new_user = User(name, email, hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return user_schema.jsonify(new_user), 201

@user_bp.route('/login', methods=['POST'])
def login():
    email = request.json.get('email', None) 
    password = request.json.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        expires = datetime.timedelta(hours=24)
        access_token = create_access_token(identity=str(user.id), expires_delta=expires)
        return jsonify({'token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    
@user_bp.route('/user', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(logged_in_as=user_schema.dump(user)), 200


@user_bp.route('/user', methods=['GET'])
def get_users():
    all_users = User.query.all()
    result = users_schema.dump(all_users)
    return jsonify(result)

@user_bp.route('/user/<id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    return user_schema.jsonify(user)

@user_bp.route('/user/<id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)

    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')

    if name:
        user.name = name
    if email:
        user.email = email
    if password:
        user.password = generate_password_hash(password)
    db.session.commit()

    return user_schema.jsonify(user)

@user_bp.route('/user/<id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()

    return user_schema.jsonify(user)

