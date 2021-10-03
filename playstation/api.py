from flask import request
from flask.json import jsonify
from playstation import app
from .models import services
import random
##@app.route('/Mob_addservice' , methods=['POST','GET'])
##def Mob_addservice():
##    if request.method == 'POST' :
##        S_JSON = request.get_json()
##        id = random.randint(0,1000000)
##        S_JSON['_id'] = id
       ## services.insert_one(S_JSON) 
##        return jsonify({'id' : id})
##    else :
##       return jsonify({'JSON' : 'this URL accept Post requests only'})