from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from app.models.user import User
from app.services.user_service import add_balance, get_user_portfolio, buy, sell, search_ticker
from app import db
import logging

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/balance', methods=['GET'])
@jwt_required()
def get_user_data():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    user = User.query.get(user_id)
    if not user:
        logging.error(f"User with id: {user_id} doesn't exist")
        return jsonify({"message": f"User with id: {user_id} doesn't exist"}), 401
    return jsonify({
        'data': {'balance': user.balance}
    })

@user_bp.route('/balance', methods=['POST'])
@jwt_required()
def register():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    data = request.json
    try:
        add_balance(user_id, data)
        return jsonify({"message": "success"}), 201
    except ValueError as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"message": str(e)}), 400
    
@user_bp.route('/portfolio', methods=['GET'])
@jwt_required()
def get_portfolio():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    response = {}
    try:
        portfolio = get_user_portfolio(user_id)
        response["data"] = portfolio
        return jsonify(response), 200
    except ValueError as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"message": str(e)}), 400

@user_bp.route('/buy', methods=['POST'])
@jwt_required()
def buy_stock():
    current_user = get_jwt_identity()
    data = request.json
    user_id = current_user["id"]
    ticker = data.get('ticker')
    num_shares = data.get('num_shares')

    if not all([ticker, num_shares]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        buy(user_id=user_id, ticker=ticker.upper(), num_shares=num_shares)
        return jsonify({"message": "Stock purchased successfully"}), 200
    except ValueError as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"message": str(e)}), 400
    
@user_bp.route('/sell', methods=['POST'])
@jwt_required()
def sell_stock():
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    data = request.json
    ticker = data.get('ticker')
    num_shares = data.get('num_shares')

    if not all([ticker, num_shares]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        sell(user_id=user_id, ticker=ticker.upper(), num_shares=num_shares)
        return jsonify({"message": "Stock sold successfully"}), 200
    except ValueError as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"message": str(e)}), 400
    
@user_bp.route('/search', methods=['GET'])
@jwt_required()
def search_stocks():
    ticker = request.args.get('ticker')
    current_user = get_jwt_identity()
    user_id = current_user["id"]
    try:
        response = search_ticker(ticker=ticker.upper(), user_id=user_id)
        return jsonify(response), 200
    except ValueError as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"message": str(e)}), 400