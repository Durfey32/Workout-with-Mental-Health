from flask import Blueprint, request, jsonify
from .models import User
from . import db, ma
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

user_bp = Blueprint('user_bp', __name__)

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'password', 'created_at')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

@user_bp.route('/user', methods=['POST'])
def signup():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']

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
    password = request.json.get('password', None)

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

@user_bp.route('/user', methods=['POST'])
def add_user():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']

    new_user = User(name, email, password)
    db.session.add(new_user)
    db.session.commit()

    return user_schema.jsonify(new_user)

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

    name = request.json['name']
    email = request.json['email']
    password = request.json['password']

    user.name = name
    user.email = email
    user.password = password
    db.session.commit()

    return user_schema.jsonify(user)

@user_bp.route('/user/<id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()

    return user_schema.jsonify(user)

