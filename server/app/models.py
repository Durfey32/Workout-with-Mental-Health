from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from datetime import datetime
from bson.objectid import ObjectId

app = Flask(__name__)

app.config['MONGO_URI'] = 'mongodb://localhost:27017/your_db_name'
mongo = PyMongo(app)

class User:
    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        self.created_at = datetime.now()

    def to_json(self):
        return {
            'name': self.name,
            'email': self.email,
            'password': self.password,
            'created_at': self.created_at
        }
    
    def __repr__(self):
        return f'<User {self.name}>'
    
@app.route('/user', methods=['POST'])
def add_user():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']

    new_user = User(name, email, password)
    mongo.db.users.insert_one(new_user.to_json())

    return jsonify(new_user.to_json())

@app.route('/user', methods=['GET'])
def get_users():
    users = mongo.db.users.find()
    return jsonify([user for user in users])

@app.route('/user/<id>', methods=['GET'])
def get_user(id):
    user = mongo.db.users.find_one({'_id': ObjectId(id)})
    return jsonify(user)

@app.route('/user/<id>', methods=['PUT'])
def update_user(id):
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']

    mongo.db.users.update_one({'_id': ObjectId(id)}, {'$set': {
        'name': name,
        'email': email,
        'password': password
    }})

    user = mongo.db.users.find_one({'_id': ObjectId(id)})
    return jsonify(user)

@app.route('/user/<id>', methods=['DELETE'])
def delete_user(id):
    mongo.db.users.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'User deleted'})

if __name__ == '__main__':
    app.run(debug=True)