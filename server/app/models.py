from . import db
import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.datetime.now)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password