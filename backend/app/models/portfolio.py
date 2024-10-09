import uuid
from app import db

class Portfolio(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    stock_id = db.Column(db.String(36), db.ForeignKey('stock.id'), nullable=False)
    num_shares = db.Column(db.Integer, nullable=False)

    stock = db.relationship('Stock', back_populates='portfolios')

    def __init__(self, **kwargs):
        super(Portfolio, self).__init__(**kwargs)
        if not self.id:
            self.id = str(uuid.uuid4())