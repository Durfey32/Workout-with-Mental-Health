import datetime
from config import db
import mongoengine as me

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

class MongoUser(me.Document):
    name = me.StringField(required=True, max_length=100),
    email = me.StringField(required=True, max_length=100, unique=True)
    password = me.StringField(required=True, max_length=100)
    created_at = me.DateTimeField(default=datetime.datetime.now)

    def __init__(self, name, email, password, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.name = name
        self.email = email
        self.password = password