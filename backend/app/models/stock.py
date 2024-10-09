import uuid
from app import db

class Stock(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticker = db.Column(db.String(10), index=True, unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)

    portfolios = db.relationship('Portfolio', back_populates='stock', lazy='dynamic')

    def __init__(self, **kwargs):
        super(Stock, self).__init__(**kwargs)
        if not self.id:
            self.id = str(uuid.uuid4())