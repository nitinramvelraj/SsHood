from flask import Blueprint, request, jsonify
from app.models.user import User
from app.services.user_service import add_balance, get_user_portfolio, buy, sell, search_ticker
from app import db
import logging

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/balance', methods=['GET'])
def get_user_data():
    user_id = request.args.get('user')
    user = User.query.get(user_id)
    if not user:
        logging.error(f"User with id: {user_id} doesn't exist")
        return jsonify({"message": f"User with id: {user_id} doesn't exist"}), 401
    return jsonify({
        'balance': user.balance
    })

@user_bp.route('/balance', methods=['POST'])
def register():
    data = request.json
    logging.info(f"Current payload {data}")
    try:
        add_balance(data)
        return jsonify({"message": "success"}), 201
    except ValueError as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"message": str(e)}), 400
    
@user_bp.route('/portfolio', methods=['GET'])
def get_portfolio():
    user_id = request.args.get('user')
    try:
        portfolio = get_user_portfolio(user_id)
        return jsonify(portfolio)
    except ValueError as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"message": str(e)}), 400

@user_bp.route('/buy', methods=['POST'])
def buy_stock():
    data = request.json
    user_id = data.get('user')
    ticker = data.get('ticker')
    num_shares = data.get('num_shares')

    if not all([user_id, ticker.upper(), num_shares]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        buy(user_id=user_id, ticker=ticker, num_shares=num_shares)
        return jsonify({"message": "Stock purchased successfully"}), 200
    except ValueError as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"message": str(e)}), 400
    
@user_bp.route('/sell', methods=['POST'])
def sell_stock():
    data = request.json
    user_id = data.get('user')
    ticker = data.get('ticker')
    num_shares = data.get('num_shares')

    if not all([user_id, ticker, num_shares]):
        return jsonify({"error": "Missing required parameters"}), 400

    try:
        sell(user_id=user_id, ticker=ticker.upper(), num_shares=num_shares)
        return jsonify({"message": "Stock sold successfully"}), 200
    except ValueError as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"message": str(e)}), 400
    
@user_bp.route('/search', methods=['GET'])
def search_stocks():
    ticker = request.args.get('ticker')
    user = request.args.get('user')
    try:
        response = search_ticker(ticker=ticker.upper(), user_id=user)
        return jsonify(response), 200
    except ValueError as e:
        logging.error(f"Error: {str(e)}")
        return jsonify({"message": str(e)}), 400