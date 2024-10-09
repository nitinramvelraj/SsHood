from app import create_app, db
from app.models import user, stock, portfolio, transaction

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'User': user.User, 'Stock': stock.Stock, 
            'Portfolio': portfolio.Portfolio, 'Transaction': transaction.Transaction}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)