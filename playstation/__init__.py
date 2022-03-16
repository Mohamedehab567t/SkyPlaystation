from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import json
from datetime import datetime
app = Flask(__name__)
app.config['SECRET_KEY'] = '0af460gfdgdf4h6gf54hd5f3fas5341gs8c981fc2a0564gdf6ggh54'
cID = 2685

db = SQLAlchemy(app)
migrate = Migrate(app , db)
app.config['SECRET_KEY'] = 'df534g53sae1df5d3sr5f15dr341fc532fd1t6rf54152e41489gt65e'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///play.db'
def toJson(data):
    if isinstance(data , str) :
        return json.loads(data)
    else :
        return data

def to12(string):
    in_time = datetime.strptime(string, "%H:%M")
    out_time = datetime.strftime(in_time, "%I:%M %p")
    return out_time
app.jinja_env.filters['toJson'] = toJson
app.jinja_env.filters['to12'] = to12

from playstation import urls
