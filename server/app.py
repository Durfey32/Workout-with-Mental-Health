from app import create_app
import os
import logging

# Loggs the environment and MongoDB URI
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the app instance using the factory function
app = create_app()

if __name__ == "__main__":
    # Log the environment and MongoDB URI
    env = os.getenv("FLASK_ENV", "development")
    logger.info(f"Starting app in {env} environment.")
    
    port = int(os.environ.get("PORT", 3001))
    debug = env == "development"
    logger.info(f"Running on port {port}, debug={debug}")
    app.run(host="0.0.0.0", port=port, debug=debug)