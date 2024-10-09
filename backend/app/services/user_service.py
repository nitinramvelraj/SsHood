from app.models.user import User
from app.models.portfolio import Portfolio
from app.models.stock import Stock
from app.models.transaction import Transaction
from app.services.yfinance_service import get_current_stock_info
from app import db
import logging

def add_balance(user_id, data):
    if "credit" not in data:
        raise ValueError("credit needs to be specified")
    credits = data["credit"]
    user = User.query.get(user_id)
    if not user:
        logging.error(f"User with id: {user_id} doesn't exist")
        raise ValueError(f"User with id: {user_id} doesn't exist")
    try:
        user.balance += float(credits)
        db.session.commit()
        logging.info(f"Updated balance for user {user_id}. New balance: {user.balance}")
    except Exception as e:
        db.session.rollback()
        logging.error(f"Failed to update balance for user {user_id}. Error: {str(e)}")
        raise ValueError("Failed to update user balance.")
    
def get_user_portfolio(user_id):
    if not user_id:
        raise ValueError("User ID is required")

    portfolio_items = Portfolio.query.options(
        db.joinedload(Portfolio.stock)
    ).filter_by(user_id=user_id).all()

    if not portfolio_items:
        return []

    portfolio_data = [
        {
            'stock_id': item.stock_id,
            'ticker': item.stock.ticker,
            'name': item.stock.name,
            'num_shares': item.num_shares,
            'value': get_current_stock_info(item.stock.ticker)["price"] * item.num_shares
        }
        for item in portfolio_items
    ]

    return portfolio_data

def buy(user_id, ticker, num_shares):
    try:
        num_shares = int(num_shares)
    except ValueError:
        raise ValueError(f"Invalid number of shares '{num_shares}'")
    
    user = User.query.get(user_id)
    if not user:
        raise ValueError("User not found")

    stock_info = get_current_stock_info(ticker)
    total_cost = stock_info["price"] * num_shares

    if user.balance < total_cost:
        raise ValueError("Insufficient funds")

    stock = Stock.query.filter_by(ticker=ticker).first()
    if not stock:
        stock = Stock(ticker=ticker, name=stock_info["name"])
        db.session.add(stock)

    try:
        user.balance -= total_cost

        portfolio = Portfolio.query.filter_by(user_id=user_id, stock_id=stock.id).first()
        if portfolio:
            portfolio.num_shares += num_shares
        else:
            portfolio = Portfolio(user_id=user_id, stock_id=stock.id, num_shares=num_shares)
            db.session.add(portfolio)

        transaction = Transaction(user_id=user_id, stock_id=stock.id, 
                                  transaction_type='buy', price=stock_info["price"])
        db.session.add(transaction)

        db.session.commit()
        logging.info("Stock purchased successfully")

    except db.IntegrityError:
        db.session.rollback()
        raise ValueError("Error completing transaction")

def sell(user_id, ticker, num_shares):
    try:
        num_shares = int(num_shares)
    except ValueError:
        raise ValueError(f"Invalid number of shares '{num_shares}'")

    user = User.query.get(user_id)
    if not user:
        raise ValueError("User not found")

    stock = Stock.query.filter_by(ticker=ticker).first()
    if not stock:
        raise ValueError("Stock not found")

    portfolio = Portfolio.query.filter_by(user_id=user_id, stock_id=stock.id).first()
    if not portfolio or portfolio.num_shares < num_shares:
        raise ValueError("User does not have enough shares to sell")

    stock_info = get_current_stock_info(ticker)
    total_value = stock_info["price"] * num_shares

    try:
        user.balance += total_value
        portfolio.num_shares -= num_shares
        if portfolio.num_shares == 0:
            db.session.delete(portfolio)
        transaction = Transaction(user_id=user_id, stock_id=stock.id, 
                                  transaction_type='sell', price=stock_info["price"])
        db.session.add(transaction)
        db.session.commit()
    except db.IntegrityError:
        db.session.rollback()
        raise ValueError("Error completing transaction")
    
def search_ticker(ticker, user_id):
    response = {}
    data = get_current_stock_info(ticker)
    data["currentPosition"] = 0
    data["currentPositionValue"] = 0
    user = User.query.get(user_id)
    if not user:
        raise ValueError("User not found")
    stock = Stock.query.filter_by(ticker=ticker).first()
    if not stock:
        response["data"] = data
        return response
    portfolio = Portfolio.query.filter_by(user_id=user_id, stock_id=stock.id).first()
    if not portfolio:
        response["data"] = data
        return response
    data["currentPosition"] = portfolio.num_shares
    data["currentPositionValue"] = portfolio.num_shares * data["price"]
    response["data"] = data
    return response