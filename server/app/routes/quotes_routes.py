from flask import Blueprint, jsonify
import random
import json
import os

quotes_bp = Blueprint('quotes_bp', __name__)

base_dir = os.path.abspath(os.path.dirname(__file__))
quotes_file_path = os.path.join(base_dir, 'Resources', 'quotes.csv')

with open(quotes_file_path, 'r', encoding='utf-8') as file:
    quotes = json.load(file)

@quotes_bp.route('/quotes', methods=['GET'])
def generate_random_quote():
    quote = random.choice(quotes)
    return jsonify(quote)
