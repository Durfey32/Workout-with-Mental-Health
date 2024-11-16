import datetime
from config import db
import mongoengine as me

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    userName = db.Column(db.String(100))
    password = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.datetime.now)

    def __init__(self, name, userName, password):
        self.name = name
        self.userName = userName
        self.password = password

class UserSchema(me.Schema):
    class Meta:
        fields = ('id', 'name', 'userName', 'password', 'created_at')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class MongoUser(me.Document):
    name = me.StringField(required=True, max_length=100),
    userName = me.StringField(required=True, max_length=100, unique=True)
    password = me.StringField(required=True, max_length=100)
    created_at = me.DateTimeField(default=datetime.datetime.now)

    def __init__(self, name, userName, password, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.name = name
        self.userName = userName
        self.password = password