from tokenize import Special

from sqlalchemy import null
from playstation import db
import json
class servicesSQL(db.Model):
    _id = db.Column(db.Integer , primary_key=True)
    S_name = db.Column(db.String(50) , unique=True , nullable = False)
    S_icon = db.Column(db.String(50) , unique=False , nullable = False)
    S_status = db.Column(db.String(50) , unique=False , nullable = False)
    S_price = db.Column(db.Integer , unique=False , nullable = False)
    Multi_price = db.Column(db.Integer , unique=False , nullable = True)


    def FromJson(self , dict):
        self.S_name = dict['S-name']
        self.S_icon = dict['S-icon']
        self.S_status = dict['S-status']
        self.S_price = dict['S-price']

    def toJson(self):
        return{
            "_id" : self.id,
            "S_name" : self.S_name,
            "S_icon" : self.S_icon,        
            "S_status" : self.S_status,
            "S_price" : self.S_price
        }
    def updateStatus(self , id , stat):
        getOBJ = db.session.query(servicesSQL).get(id)
        getOBJ.S_status = stat

    def updatemain(self , id , name , price , multi):
        getOBJ = db.session.query(servicesSQL).get(id)
        getOBJ.S_name = name
        getOBJ.S_price = price
        getOBJ.Multi_price = multi

class ShiftSQL(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    box = db.Column(db.Float , unique=False , nullable = False)
    R_count = db.Column(db.Integer , unique=False , nullable = False)
    buy = db.Column(db.Integer , unique=False , nullable = False)
    TH = db.Column(db.Integer , unique=False , nullable = False)
    TP = db.Column(db.Integer , unique=False , nullable = False)

    def FromJson(self , dict):
        self.box = dict['box']
        self.R_count = dict['R_count']
        self.buy = dict['buy']
        self.TH = dict['TH']
        self.TP = dict['TP']


    def updateShift(self , id , box , count , TH , TP , buy):
        getOBJ = db.session.query(ShiftSQL).get(id)
        getOBJ.box = box
        getOBJ.R_count = count
        getOBJ.TH = TH
        getOBJ.TP = TP
        getOBJ.buy = buy


class ReciptsSQL(db.Model):
    _id = db.Column(db.Integer , primary_key=True)
    totalS = db.Column(db.Float , unique=False , nullable = False)
    totalP = db.Column(db.Float , unique=False , nullable = False)
    total = db.Column(db.Float , unique=False , nullable = False)
    dis = db.Column(db.Float , unique=False , nullable = False)
    history = db.Column(db.String , unique=False , nullable = False)
    startDT = db.Column(db.String , unique=False , nullable = False)
    startDD = db.Column(db.String , unique=False , nullable = False)
    endDT = db.Column(db.String , unique=False , nullable = False)
    endDD = db.Column(db.String , unique=False , nullable = False)
    customer = db.Column(db.String , unique=False , nullable = False)
    serachDate = db.Column(db.Date , unique=False , nullable = False)
    products = db.Column(db.String , unique=False , nullable = False)
    serviceID = db.Column(db.Integer , unique=False , nullable = False)
    serviceName = db.Column(db.String , unique=False , nullable = False)
    shiftNumber = db.Column(db.Integer , unique=False , nullable = False)
    R_n = db.Column(db.Integer , unique=False , nullable = False)
    mongo = db.Column(db.Boolean , unique=False , nullable = False)


    def FromJson(self , dict):
        self.totalS = dict['totalS']
        self.totalP = dict['totalP']
        self.total = dict['total']
        self.dis = dict['dis']
        self.history = json.dumps(dict['history'])
        self.startDT = dict['startDT']
        self.startDD = dict['startDD']
        self.endDT = dict['endDT']
        self.endDD = dict['endDD']
        self.serachDate = dict['serachDate']
        self.products = json.dumps(dict['products'])
        self.serviceID = dict['serviceID']
        self.serviceName = dict['serviceName']
        self.shiftNumber = dict['shiftNumber']
        self.R_n = dict['R_n']
        self.customer = dict['customer']
        self.mongo = dict['mongo']

    def UpdateMongoState(self , id):
        getOBJ = db.session.query(ReciptsSQL).get(id)
        getOBJ.mongo = True


class ColorsSQL(db.Model):
    _id = db.Column(db.Integer , primary_key=True)
    avacolor = db.Column(db.String , unique=False , nullable = False)
    lockcolor = db.Column(db.String , unique=False , nullable = False)
    busycolor = db.Column(db.String , unique=False , nullable = False)


class ExpensesSQL(db.Model):
    _id = db.Column(db.Integer , primary_key=True)
    t = db.Column(db.String , unique=False , nullable = False)
    v = db.Column(db.String , unique=False , nullable = False)
    d = db.Column(db.String , unique=False , nullable = False)
    s = db.Column(db.Date , unique=False , nullable = False)
    sn = db.Column(db.Integer , unique=False , nullable = False)
    mongo = db.Column(db.Boolean , unique=False , nullable = False)

    def FromJson(self , dict):
        self.t = dict['t']
        self.v = dict['v']
        self.d = dict['d']
        self.s = dict['s']
        self.sn = dict['sn']
        self.mongo = dict['mongo']


class ProductsSQL(db.Model):
    _id = db.Column(db.Integer , primary_key=True)
    p_price = db.Column(db.Float , unique=False , nullable = False)
    p_name = db.Column(db.String , unique=False , nullable = False)
    mesurment = db.Column(db.String , unique=False , nullable = False)
    quantityinbox = db.Column(db.Float , unique=False , nullable = False)
    drawn = db.Column(db.Float , unique=False , nullable = False)
    boxquantity = db.Column(db.Float , unique=False , nullable = False)
    openboxquantity = db.Column(db.Float , unique=False , nullable = False)
    drawn = db.Column(db.Float , unique=False , nullable = False)
    totalquantity = db.Column(db.Float , unique=False , nullable = False)
    sa7ba = db.Column(db.String , unique=False , nullable = False)


    def FromJson(self , dict):
        self.p_price = dict['P-price']
        self.p_name = dict['P-name']
        self.mesurment = "-"
        self.quantityinbox = 0
        self.boxquantity = 0
        self.drawn = 0
        self.openboxquantity = 0
        self.totalquantity = dict['quantityinbox']
        self.sa7ba = 0


    def reFill(self,id , quantity):
        getOBJ = db.session.query(ProductsSQL).get(id)
        getOBJ.totalquantity = getOBJ.totalquantity + float(quantity)


    def UpadateTotal(self , id , quantity):
        getOBJ = db.session.query(ProductsSQL).get(id)
        getOBJ.drawn = getOBJ.drawn + float(quantity)
        getOBJ.totalquantity = getOBJ.totalquantity - float(quantity)
                    


    def Upadate(self , id , name , price):
        getOBJ = db.session.query(ProductsSQL).get(id)
        getOBJ.p_name = name
        getOBJ.p_price = price

    def UpdateStorage(self , id , q):
        getOBJ = db.session.query(ProductsSQL).get(id)
        getOBJ.totalquantity = float(getOBJ.totalquantity) + (float(q))




class msgSQL(db.Model):
    _id = db.Column(db.Integer , primary_key=True)
    msg = db.Column(db.String , unique=False , nullable = False)

    def FromJson(self , dict):
        self.msg = dict['msg']
    def update(seld , id , mes):
        getOBJ = db.session.query(msgSQL).get(id)
        getOBJ.msg = mes


class CustomerSQL(db.Model):
    _id = db.Column(db.Integer , primary_key=True)
    name = db.Column(db.String , unique=True , nullable = False)
    phone = db.Column(db.String , unique=False , nullable = False)
    R_n = db.Column(db.Integer , unique=False , nullable = False)
    payed = db.Column(db.Float , unique=False , nullable = False)
    special = db.Column(db.Float , unique=False , nullable = True)

    def FromJson(self , dict):
        self.name = dict['name']
        self.phone = dict['phone']
        self.R_n = 0
        self.payed = 0

    def UpdateCustomer(self , id  , payed) :
        getOBJ = db.session.query(CustomerSQL).get(id)
        getOBJ.R_n = getOBJ.R_n + 1
        getOBJ.payed = getOBJ.payed + float(payed)


    def Updatespecial(self , id  , s) :
        getOBJ = db.session.query(CustomerSQL).get(id)
        if(s != ''):
            getOBJ.special = int(s) / 100
        else :
            getOBJ.special = None

class UserSQL(db.Model):
    _id = db.Column(db.Integer , primary_key=True)
    name = db.Column(db.String , unique=False , nullable = False)
    state = db.Column(db.String , unique=False , nullable = False)
    password = db.Column(db.String , unique=False , nullable = False)

    def FromJson(self , dict):
        self.name = dict['name']
        self.password = dict['password']
        self.state = dict['state']

    def UpdateUser(self , id , name , password , state):
        getOBJ = db.session.query(UserSQL).get(id)
        getOBJ.name = name
        getOBJ.password = password
        getOBJ.state = state


class DrawnSql(db.Model):
    _id = db.Column(db.Integer , primary_key=True)
    name = db.Column(db.String , unique=False , nullable = False)
    shiftnumber = db.Column(db.Integer , unique=False , nullable = False)
    r_n = db.Column(db.Integer , unique=False , nullable = False)
    quantity = db.Column(db.String , unique=False , nullable = False)
    cost = db.Column(db.String , unique=False , nullable = False)
    date = db.Column(db.Date , unique=False , nullable = False)

    def FromJson(self , dict):
        self.name = dict['name']
        self.shiftnumber = dict['shiftnumber']
        self.r_n = dict['r_n']
        self.quantity = dict['quantity']
        self.cost = dict['cost']
        self.date = dict['date']


class RulsSql(db.Model):
    _id = db.Column(db.Integer , primary_key=True)
    count = db.Column(db.Float , unique=False , nullable = False)
    value = db.Column(db.Integer , unique=False , nullable = False)

    def FromJson(self , dict):
        self.count = dict['count']
        self.value = int(dict['value']) / 100

    def update(seld , id , c , v):
        getOBJ = db.session.query(RulsSql).get(id)
        getOBJ.count = c
        getOBJ.value = int(v) / 100