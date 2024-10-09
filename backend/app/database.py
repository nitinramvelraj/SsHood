from app import db

def init_db() -> None:
    db.create_all()