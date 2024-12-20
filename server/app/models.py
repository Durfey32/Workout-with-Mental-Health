import datetime
from marshmallow import Schema, fields
import mongoengine as me

class MongoUser(me.Document):
    name = me.StringField(required=True, max_length=100)
    username = me.StringField(required=True, max_length=100, unique=True)
    password = me.StringField(required=True, max_length=100)
    created_at = me.DateTimeField(default=datetime.datetime.now)

    def __init__(self, name, username, password, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.name = name
        self.username = username
        self.password = password

class UserSchema(Schema):
    name = fields.Str()
    username = fields.Str()
    password = fields.Str()
    created_at = fields.DateTime()

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class Workout:
    def __init__(self, name, type, muscle, equipment, difficulty, instructions, user_id=None):
        self.name = name
        self.type = type
        self.muscle = muscle
        self.equipment = equipment
        self.difficulty = difficulty
        self.instructions = instructions
        self.user_id = user_id

class WorkoutSchema(Schema):
    name = fields.Str()
    type = fields.Str()
    muscle = fields.Str()
    equipment = fields.Str()
    difficulty = fields.Str()
    instructions = fields.Str()
    user_id = fields.Str()

workout_schema = WorkoutSchema()
workouts_schema = WorkoutSchema(many=True)

class Meal:
    def __init__(self, name, type='Custom', calories=0, protein=0, carbs=0, fat=0, image='', user_id=None):
        self.name = name
        self.type = type
        self.calories = calories
        self.protein = protein
        self.carbs = carbs
        self.fat = fat
        self.image = image
        self.user_id = user_id


class MealSchema(Schema):
    name = fields.Str()
    type = fields.Str()
    calories = fields.Int()
    protein = fields.Int()
    carbs = fields.Int()
    fat = fields.Int()
    user_id = fields.Str()
    image = fields.Str()

meal_schema = MealSchema()
meals_schema = MealSchema(many=True)

class Journal:
    def __init__(self, title, content, timestamp, user_id):
        self.title = title
        self.content = content
        self.timestamp = timestamp
        self.user_id = user_id

class JournalSchema(Schema):
    title = fields.Str()
    content = fields.Str()
    timestamp = fields.DateTime()
    user_id = fields.Str()

journal_schema = JournalSchema()
journals_schema = JournalSchema(many=True)