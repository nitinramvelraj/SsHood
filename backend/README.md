# Backend Setup  
### Setup instructions  
  
Start backend in its own terminal window  
  
Start by creating a virtual environment.  
```python3 -m venv .venv```  
Activate the virtual environment.  
For mac:  
```source .venv/bin/activate```  
For windows:  
```.venv/Scripts/Activate```  
Install dependencies.  
```pip install -r requirements.txt```  
Create a local .env file with the following contents in the ./backend directory  
```
FLASK_APP=app:create_app
FLASK_ENV=development
SECRET_KEY=some-secret-value
```
Run server locally for development  
```flask run```  