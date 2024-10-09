# Backend Setup  
## Setup instructions  
  
Start backend in its own terminal window  
  
Navigate to /backend directory  
Start by creating a virtual environment in the (assumes you have python3 installed).  
```python3 -m venv .venv```  
Activate the virtual environment.  
For mac:  
```source .venv/bin/activate```  
For windows:  
```.venv/Scripts/Activate```  
Install dependencies.  
```pip install -r requirements.txt```  
### First time setup
Create a local .env file with the following contents in the ./backend directory  
```
FLASK_APP=app:create_app
FLASK_ENV=development
SECRET_KEY=some-secret-value
```
Create local database by running the following commands in the terminal  
```
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```
Run server locally for development  
```flask run```  
### Subsequent runs
```flask run```  