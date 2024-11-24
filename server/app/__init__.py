from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_pymongo import PyMongo
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from config import config
from dotenv import load_dotenv
import os
import logging

load_dotenv()

ma = Marshmallow()
jwt = JWTManager()
mongo = PyMongo()

def create_app():
    app = Flask(__name__, static_folder='../../client/dist', static_url_path='/')

    env = os.getenv("FLASK_ENV", "default")
    app.config.from_object(config.get(env, config["default"]))
    print(f"Loaded configuration for {env} environment.")

    CORS(app)

    # Ensure MONGO_URI is set
    app.config['MONGO_URI'] = os.getenv('MONGO_URI')
    if not app.config['MONGO_URI']:
        raise ValueError("MONGO_URI environment variable is not set")

    mongo.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)

    # MongoDB connection check
    uri = app.config['MONGO_URI']
    client = MongoClient(uri, server_api=ServerApi('1'))
    try:
        client.admin.command('ping')
        print("Pinged your deployment. Successfully connected to MongoDB!")
        print(os.getenv('MONGO_URI'))
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise RuntimeError("MongoDB connection failed. Check your URI and network settings.") from e

    with app.app_context():
        from .routes.user_routes import user_bp
        from .routes.quotes_routes import quotes_bp
        from .routes.workout_routes import workout_bp
        from .routes.meal_routes import meal_bp
        from .routes.journal_routes import journal_bp

        app.register_blueprint(user_bp)
        app.register_blueprint(quotes_bp)
        app.register_blueprint(workout_bp)
        app.register_blueprint(meal_bp)
        app.register_blueprint(journal_bp)

    @app.route('/')
    def serve_react_app():
        return send_from_directory(app.static_folder, 'index.html')

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 3001))
    debug = os.getenv('FLASK_DEBUG', 'True') == 'True'
    app.run(host='0.0.0.0', port=port, debug=debug)