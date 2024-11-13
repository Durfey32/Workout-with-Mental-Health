from flask import Blueprint, request, jsonify
from .models import User
from . import db, ma

user_bp = Blueprint('user_bp', __name__)

class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'password', 'created_at')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

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

