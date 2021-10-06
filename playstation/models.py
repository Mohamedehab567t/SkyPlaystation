from pymongo import MongoClient
import certifi

ca = certifi.where()
# Teto (used)  : mongodb+srv://admin:99059459@ps1.df6mm.mongodb.net/PS?retryWrites=true&w=majority
# Sky  : mongodb+srv://admin:99059459@pss.eukti.mongodb.net/PS?retryWrites=true&w=majority
client = MongoClient("mongodb+srv://admin:99059459@ps1.df6mm.mongodb.net/PS?retryWrites=true&w=majority" , tlsCAFile=ca)
PS = client.get_database('PS')
users = PS.get_collection('users')
services = PS.get_collection('services')
products = PS.get_collection('products')
Shifts = PS.get_collection('Shifts')
Recipts = PS.get_collection('recipts')
msg = PS.get_collection('msg')
expenses = PS.get_collection('expenses')
colors = PS.get_collection('colors')