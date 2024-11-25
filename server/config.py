import os

class Config:
    """Base configuration."""
    SECRET_KEY = os.getenv("SECRET_KEY", "my_precious")
    DEBUG = False
    TESTING = False
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/default_db")

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/dev_db")

class TestingConfig(Config):
    """Testing configuration."""
    DEBUG = True
    TESTING = True
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/test_db")

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    
    MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/prod_db")

config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}