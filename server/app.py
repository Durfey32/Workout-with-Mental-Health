from app import db, create_app
from flask_migrate import Migrate
import os

app = create_app()

migrate = Migrate(app, db)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3001))
    debug = os.getenv('DEBUG', 'True') == 'True'
    app.run(host='0.0.0.0', port=port, debug=debug)