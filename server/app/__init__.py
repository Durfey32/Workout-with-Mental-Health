from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import datetime

db = SQLAlchemy()
ma = Marshmallow()

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    ma.init_app(app)

    with app.app_context():
        from .routes import user_bp
        app.register_blueprint(user_bp)

    return app

