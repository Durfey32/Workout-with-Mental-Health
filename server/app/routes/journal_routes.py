from flask import Blueprint, jsonify, request
from app import mongo
from app.models import Journal, journal_schema, journals_schema
from bson.objectid import ObjectId
from flask_jwt_extended import get_jwt_identity
from datetime import datetime
from flask_jwt_extended import jwt_required


journal_bp = Blueprint('journal', __name__)

# Get all journal entries
journal_collection = mongo.db.journals
for journal in journal_collection.find():
    print(journal)

# Get all journal entries
@journal_bp.route('/api/journal', methods=['GET'])
def get_journals():
    journal_collection = mongo.db.journals
    journals = journal_collection.find()

    serialized_journals = []
    for journal in journals:
        journal['_id'] = str(journal['_id'])
        if 'timestamp' in journal and isinstance(journal['timestamp'], str):
            try:
                journal['timestamp'] = datetime.fromisoformat(journal['timestamp'])
            except ValueError:
                journal['timestamp'] = None
        serialized_journals.append(journal)

    return jsonify(journals_schema.dump(journals)), 200

# Get a single journal entry by ID
@journal_bp.route('/api/journal/<id>', methods=['GET'])
def get_journal(id):
    journal_collection = mongo.db.journals
    try:
        journal = journal_collection.find_one({'_id': ObjectId(id)})
        if journal:
            return jsonify(journal_schema.dump(journal)), 200
        else:
            return jsonify({'message': 'Journal entry not found'}), 404
    except Exception as e:
        return jsonify({'message': 'Invalid journal ID', 'error': str(e)}), 400

# Add a new journal entry
@journal_bp.route('/api/journal', methods=['POST'])
@jwt_required()
def add_journal():
    try:
        current_user_id = get_jwt_identity()
        title = request.json.get('title')
        content = request.json.get('content')
        timestamp = request.json.get('timestamp') or datetime.utcnow().isoformat()
        
        print(f"Received title: {title}, content: {content}, timestamp: {timestamp}")

        user_id = current_user_id
        # print(request.headers.get('Authorization'))

        if not all([title, content, timestamp, user_id]):
            return jsonify({'message': 'Missing required fields'}), 400

        new_journal = {
            'title': title,
            'content': content,
            'timestamp': timestamp,
            'user_id': user_id
        }
        journal_collection = mongo.db.journals
        # journal_collection.insert_one(new_journal.__dict__)
        result = journal_collection.insert_one(new_journal)


        new_journal['_id'] = str(result.inserted_id)
        return jsonify(new_journal), 201
    except Exception as e:
        print(f'Error: {e}')
        return jsonify({'message': 'An error occurred while adding the journal entry.', 'error': str(e)}), 500


# Update an existing journal entry
@journal_bp.route('/api/journal/<id>', methods=['PUT'])
def update_journal(id):
    journal_collection = mongo.db.journals
    journal = journal_collection.find_one({'_id': ObjectId(id)})

    if not journal:
        return jsonify({'message': 'Journal entry not found'}), 404

    journal['title'] = request.json['title']
    journal['content'] = request.json['content']
    journal['timestamp'] = request.json['timestamp']

    journal_collection.update_one({'_id': ObjectId(id)}, {'$set': journal})

    return jsonify(journal_schema.dump(journal)), 200

# Delete a journal entry
@journal_bp.route('/api/journal/<id>', methods=['DELETE'])
def delete_journal(id):
    journal_collection = mongo.db.journals
    journal = journal_collection.find_one({'_id': ObjectId(id)})

    if not journal:
        return jsonify({'message': 'Journal entry not found'}), 404

    journal_collection.delete_one({'_id': ObjectId(id)})

    return jsonify({'message': 'Journal entry deleted successfully'}), 200
