from app.models.user import User
from app import db
from app.utils.password_utils import hash_password, check_password
import logging

def register_user(data):
    if User.query.filter_by(email=data['email']).first():
        raise ValueError("Email already registered")

    hashed_password = hash_password(data['password'])
    new_user = User(
        firstname=data['firstname'],
        lastname=data['lastname'],
        email=data['email'],
        password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()
    logging.info(f"New user registered: {new_user.email}")
    return new_user

def login_user(data):
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password(data['password'], user.password):
        raise ValueError("Invalid email or password")
    logging.info(f"User logged in: {user.email}")
    return user

