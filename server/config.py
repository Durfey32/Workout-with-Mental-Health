import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///workout.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'my_precious')
    DEBUG = False
    TESTING = False

    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/default_db')

class DevelopmentConfig(Config):
    DEBUG = True
    MONGO_URI = os.getenv('DEV_MONGO_URI', 'mongodb://localhost:27017/dev_db')

class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    MONGO_URI = os.getenv('TEST_MONGO_URI', 'mongodb://localhost:27017/test_db')

class ProductionConfig(Config):
    DEBUG = False
    MONGO_URI = os.getenv('PROD_MONGO_URI', 'mongodb://localhost:27017/prod_db')

config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig
}