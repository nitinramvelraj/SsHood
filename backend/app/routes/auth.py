from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.services.auth_service import register_user, login_user
from app import db
import logging

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    logging.info(f"Current payload {data}")
    try:
        response = {}
        user = register_user(data)
        access_token = create_access_token(identity=user.to_dict())
        data = user.to_dict()
        data["token"] = access_token
        response["data"] = data
        return jsonify(response), 201
    except ValueError as e:
        logging.error(f"Registration error: {str(e)}")
        return jsonify({"message": str(e)}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    try:
        response = {}
        user = login_user(data)
        access_token = create_access_token(identity=user.to_dict())
        data = user.to_dict()
        data["token"] = access_token
        response["data"] = data
        return jsonify(response), 200
    except ValueError as e:
        logging.error(f"Login error: {str(e)}")
        return jsonify({"message": str(e)}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200