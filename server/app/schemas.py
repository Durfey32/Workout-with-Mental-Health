from marshmallow import Schema, fields
from . import ma

class WorkoutSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'type', 'muscle', 'equipment', 'difficulty', 'instructions')

# Single workout schema
workout_schema = WorkoutSchema()

# Multiple workouts schema
workouts_schema = WorkoutSchema(many=True)

class JournalSchema(Schema):
    id = fields.Str(attribute='_id')
    title = fields.Str(required=True)
    content = fields.Str(required=True)
    timestamp = fields.Str()
    user_id = fields.Str(required=True)