from playstation.models import users
import random
class User():
    def __init__(self , __n , __username , __type , __password) :
        self.id = random.randint(0,100000)
        self.n = __n
        self.username = __username
        self.type = __type
        self.password = __password
    
    def Saveuser(user):
        cashier = {
            "_id" : user.id,
            "n" : user.n,
            "username" : user.username,
            "password" : user.password,
            "type" : user.type
        }
        users.insert_one(cashier)