import uuid
from app import db

class Transaction(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    stock_id = db.Column(db.String(36), db.ForeignKey('stock.id'), nullable=False)
    transaction_type = db.Column(db.String(10), nullable=False)  # 'buy' or 'sell'
    price = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __init__(self, **kwargs):
        super(Transaction, self).__init__(**kwargs)
        if not self.id:
            self.id = str(uuid.uuid4())