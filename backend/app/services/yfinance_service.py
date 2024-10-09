import yfinance as yf

def get_current_stock_info(ticker: str) -> dict:
    ticker = yf.Ticker(ticker)
    try:
        info = ticker.info
        return {"price": info["currentPrice"],
         "name": info["shortName"]}
         
    except:
        raise ValueError("Ticker does not exist")