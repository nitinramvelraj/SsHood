from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.jwt_middleware import jwt
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
import logging

db = SQLAlchemy()
migrate = Migrate()

def create_app():
    app = Flask(__name__)
    CORS(app, 
         resources={r'*': {"origins": "http://localhost:3000"}},
         supports_credentials=True,
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'],
         expose_headers=['Access-Control-Allow-Origin'])
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Import and register models
    from app.models import user, stock, portfolio, transaction
    
    # Register blueprints
    from app.routes import auth, health, user
    app.register_blueprint(health.health_bp)
    app.register_blueprint(auth.auth_bp)
    app.register_blueprint(user.user_bp)

    logging.basicConfig(level=logging.INFO)
    app.logger.info('Flask app initialized')

    return app