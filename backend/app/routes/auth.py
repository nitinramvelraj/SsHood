from flask import Blueprint, request, jsonify
from app.services.auth_service import register_user, login_user
from app import db
import logging

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    logging.info(f"Current payload {data}")
    try:
        user = register_user(data)
        return jsonify(user.to_dict()), 201
    except ValueError as e:
        logging.error(f"Registration error: {str(e)}")
        return jsonify({"message": str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    try:
        user = login_user(data)
        return jsonify(user.to_dict()), 200
    except ValueError as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({"message": str(e)}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200