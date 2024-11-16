from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from config import Config
import os

ma = Marshmallow()
jwt = JWTManager()
mongo = PyMongo()

def create_app():
    app = Flask(__name__, static_folder='../../client/dist', static_url_path='/')
    app.config.from_object(Config)
    CORS(app)

    app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/workout_with_mental_health')
 
    mongo.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        from .routes import user_bp, quotes_bp
        app.register_blueprint(user_bp)
        app.register_blueprint(quotes_bp)

    @app.route('/')
    def server_react_app():
        return send_from_directory(app.static_folder, 'index.html')

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 3001))
    debug = os.getenv('DEBUG', 'True') == 'True'
    app.run(host='0.0.0.0', port=port, debug=debug)

