from flask import Blueprint, request, jsonify
import requests

api_bp = Blueprint('api_bp', __name__)

@api_bp.route('/exercises', methods=['GET'])
def get_exercises():
    muscle = request.args.get('muscle', 'biceps')
    api_url = 'https://api.api-ninjas.com/v1/exercises?muscle={}'.format(muscle)
    response = requests.get(api_url, headers={'X-Api-Key': 't79x9D05SpMMobuHZoL+3A==iigH52Z3n4indYPg'})
    
    if response.status_code == requests.codes.ok:
        return jsonify(response.json())
    else:
        return jsonify({"error": response.status_code, "message": response.text}), response.status_code