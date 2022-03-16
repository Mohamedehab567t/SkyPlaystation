from pymongo import MongoClient
import certifi

ca = certifi.where()
# Teto  : mongodb+srv://admin:99059459@ps1.df6mm.mongodb.net/PS?retryWrites=true&w=majority
# Sky : mongodb+srv://admin:99059459@pss.eukti.mongodb.net/PS?retryWrites=true&w=majority
# Elazazy (used) : mongodb+srv://admin:99059459@analog.uuzgc.mongodb.net/Analog?retryWrites=true&w=majority
def ConnectToServer():
    # users services products Shifts recipts msg expenses colors
    client = MongoClient("mongodb+srv://admin:99059459@analog.uuzgc.mongodb.net/Analog?retryWrites=true&w=majority" , tlsCAFile=ca)
    PS = client.get_database('PS')
    Recipts = PS.get_collection('Recipts')
    return Recipts


