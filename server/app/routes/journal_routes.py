from flask import Blueprint, jsonify, request
from app import mongo
from app.models import Journal, journal_schema, journals_schema
from bson.objectid import ObjectId

journal_bp = Blueprint('journal_bp', __name__)

# Get all journal entries
@journal_bp.route('/api/journal', methods=['GET'])
def get_journals():
    journal_collection = mongo.db.journals
    journals = journal_collection.find()
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
def add_journal():
    title = request.json['title']
    content = request.json['content']
    timestamp = request.json['timestamp']

    new_journal = Journal(title, content, timestamp)
    journal_collection = mongo.db.journals
    journal_collection.insert_one(new_journal.__dict__)

    return jsonify(journal_schema.dump(new_journal)), 201

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
