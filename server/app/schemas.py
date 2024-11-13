from marshmallow import Schema, fields
from . import ma

class WorkoutSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'type', 'muscle', 'equipment', 'difficulty', 'instructions')

# Single workout schema
workout_schema = WorkoutSchema()

# Multiple workouts schema
workouts_schema = WorkoutSchema(many=True)