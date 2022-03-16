from wtforms.validators import ValidationError
from flask import render_template
import requests
import random
import dateutil.parser
from .models import ConnectToServer
from playstation import db
from .database import ExpensesSQL, ProductsSQL , ShiftSQL , ReciptsSQL , msgSQL , servicesSQL , UserSQL , DrawnSql , CustomerSQL

def Validate_account(self, n):
    user = db.session.query(UserSQL).filter(UserSQL.name == n.data).first()
    if not user:
        raise ValidationError('لا يوجد مستخدم')
    
def Validate_password(self, password):
    user = db.session.query(UserSQL).filter(UserSQL.name == self.n.data).first()
    if not user:
        raise ValidationError('لا يوجد مستخدم')
    else:
        if user.password != password.data:
            raise ValidationError('خطأ في كلمة المرور')
        

def ProductEffect(lst):
    for item in lst:
        prod = ProductsSQL()
        quantity = int(item['quantity'])
        prod.UpadateTotal(int(item['pid']) , quantity)
        
def DrawnEffect(lst , rn , sn , date):
    for item in lst :
        drawn = DrawnSql()
        drwanObj = {
            "name" : item['name'],
            "shiftnumber" : int(sn) ,
            "r_n" : int(rn) , 
            "quantity" : item['quantity'],
            "cost" : item['total'],
            "date" : date
        }
        drawn.FromJson(drwanObj)
        db.session.add(drawn)
        db.session.commit()

def CustomerEffect(name , payed):
    customer = db.session.query(CustomerSQL).filter(CustomerSQL.name == name ).first()
    updatedCustomer = CustomerSQL()
    try :
        updatedCustomer.UpdateCustomer(customer._id , payed)
    except AttributeError :
        pass
    
def AddReciptToDataBase(obj):
    serviceName = db.session.query(servicesSQL).get(int(obj['serviceID']))
    obj['serviceName'] = serviceName.__dict__['S_name']
    Sshifts = list(ShiftSQL.query.all())
    ShiftObj = Sshifts[len(Sshifts) - 1]
    lastShift = ShiftObj.__dict__
    obj['shiftNumber'] = lastShift['id']
    obj['serachDate'] = dateutil.parser.parse(obj['serachDate'])
    lastShiftBox = lastShift['box']
    lastShiftRecipts = lastShift['R_count']
    obj['R_n'] = lastShiftRecipts + 1

    serviceName.S_status = 'available'

    updateShift = ShiftSQL()
    updateShift.updateShift(lastShift['id'] , (lastShiftBox + obj['total']) , (lastShiftRecipts + 1) , (lastShift['TH'] + obj['totalS']) ,
     (lastShift['TP'] + obj['totalP']) , lastShift['buy'])

    ProductEffect(obj['products'])
    DrawnEffect(obj['products'] , obj['R_n'] , lastShift['id'] , obj['serachDate'])
    if obj['customer'] != None :
        CustomerEffect(obj['customer'] , obj['total'])

    if connected_to_internet():
        obj['mongo'] = True
       # Recipts = ConnectToServer()
       # obj['_id'] = len(list(Recipts.find())) + 1
       # Recipts.insert_one(obj)
        recipt = ReciptsSQL()
        recipt.FromJson(obj)
        db.session.add(recipt)
        db.session.commit()
    else :
        obj['mongo'] = True
       # obj['mongo'] = False
        recipt = ReciptsSQL()
        recipt.FromJson(obj)
        db.session.add(recipt)
        db.session.commit()
    msgg = list(msgSQL.query.all())
    temp = render_template('components/Fatora.html' , obj=obj, lastShiftRecipts=lastShiftRecipts , serviceName=serviceName , msgg=msgg)
    return {'box' : lastShiftBox + obj['total'] , 'R_count' : lastShiftRecipts + 1 , 'temp' : temp}

def makeAnotherShift():
    Sshifts = list(ShiftSQL.query.all())
    ShiftObj = Sshifts[len(Sshifts) - 1]
    lastShift = ShiftObj.__dict__
    lastID = lastShift['id']
    newShift = ShiftSQL()
    newShift.FromJson({'id' : lastID + 1 , 'box' : 0 , 'R_count' : 0 , 'buy' : 0 , 'TH' : 0 , 'TP' : 0})
    db.session.add(newShift)
    db.session.commit()
    
    
def ReturnReport(val):
    #AndExpressionForS = []
    #for obj in val:
    #    if 'serachDate' in obj:
    #        expression = {str(obj): {
     #       '$lt': dateutil.parser.parse(val[obj][1]),
     #       '$gte': dateutil.parser.parse(val[obj][0])
     #       }}
      #      AndExpressionForS.append(expression)
      #  else :
      #      expression = {str(obj): val[obj]}
     #       AndExpressionForS.append(expression)
   # Recipts = ConnectToServer()
   # Report = list(Recipts.find({
   # '$and' : AndExpressionForS
   # }))
   # return Report
    data = []
    conditions=[]
    dictt = {}
    if val == {} :
        result = ReciptsSQL.query.all()
        for row in result :
            data.append(row)
    else:
        string = 'SELECT * FROM reciptsSQL WHERE '
        for key in val :
            if key == "dateOfRecivieS" :
                condition = str("serachDate" +'>=')
            elif key == "dateOfRecivieE" :
                 condition = str("serachDate" +'<=')
            else:
                 condition = str(key +'=')
            conditions.append(condition+":"+key)
            dictt[key] = str(val[key])
        print(dictt)
        wholeCondition = ' AND '.join(conditions)
        string = string+wholeCondition
        result = db.session.execute(string , dictt)
        for row in result :
            data.append(row)
    print(data)
    return data

def ReturnReport2(val):
    #AndExpressionForS = []
   # for obj in val:
      #  if 'serachDate' in obj:
     #       expression = {str(obj): {
     #       '$lt': dateutil.parser.parse(val[obj][1]),
     #       '$gte': dateutil.parser.parse(val[obj][0])
     #       }}
     #       AndExpressionForS.append(expression)
     #   else :
     #       expression = {str(obj): val[obj]}
     #       AndExpressionForS.append(expression)
   # Report = list(expenses.find({
   #     '$and' : AndExpressionForS
   # }))
   # return "Report"
    data = []
    conditions=[]
    dictt = {}
    if val == {} :
        result = ExpensesSQL.query.all()
        for row in result :
            data.append(row)
    else:
        string = 'SELECT * FROM expensesSQL WHERE '
        for key in val :
            if key == "dateOfRecivieS" :
                condition = str("s" +'>=')
            elif key == "dateOfRecivieE" :
                 condition = str("s" +'<=')
            else:
                 condition = str(key +'=')
            conditions.append(condition+":"+key)
            dictt[key] = str(val[key])
        wholeCondition = ' AND '.join(conditions)
        string = string+wholeCondition
        result = db.session.execute(string , dictt)
        for row in result :
            data.append(row)
    return data

def ReturnReport3(val):
    data = []
    conditions=[]
    dictt = {}
    if val == {} :
        result = DrawnSql.query.all()
        for row in result :
            data.append(row)
    else:
        string = 'SELECT * FROM drawn_sql WHERE '
        for key in val :
            if key == "dateOfRecivieS" :
                condition = str("date" +'>=')
            elif key == "dateOfRecivieE" :
                 condition = str("date" +'<=')
            else:
                 condition = str(key +'=')
            conditions.append(condition+":"+key)
            dictt[key] = str(val[key])
        wholeCondition = ' AND '.join(conditions)
        string = string+wholeCondition
        result = db.session.execute(string , dictt)
        print(dictt)
        for row in result :
            data.append(row)
    print(data)
    return data

def getTotalOfThis(arr):
    total = {}
    total['safy'] = 0
    total['dis'] = 0
    for t in arr:
        total['safy'] += t["total"]
        total['dis'] += t["dis"]
    total['total'] = total['safy'] + total['dis']
    return total

def getTotalOfThisSearch(arr):
    total = {}
    total['safy'] = 0
    total['dis'] = 0
    for t in arr:
        total['safy'] += t.total
        total['dis'] += t.dis
    total['total'] = total['safy'] + total['dis']
    return total

def getTotalOfbuy(arr , Val1):
    total = {}
    total['t'] = 0
    for t in arr:
        total['t'] += int(t.v)
    return total

def expensesOperations(ex):
    Sshifts = list(ShiftSQL.query.all())
    ShiftObj = Sshifts[len(Sshifts) - 1]
    lastShift = ShiftObj.__dict__
    lastShiftBox = lastShift['box']
    lastShiftBuy = lastShift['buy']

    newShiftUpdate = ShiftSQL()
    newShiftUpdate.updateShift(lastShift['id'] , lastShiftBox , lastShift['R_count'] , lastShift['TH'] , lastShift['TP'] , lastShiftBuy + ex['v'])

    ex['s'] = dateutil.parser.parse(ex['s'])
    ex['sn'] = lastShift['id']
    ex['v'] = int(ex['v'])
    if connected_to_internet() :
        ex['mongo']  = True
        #expenses.insert_one(ex)
        newExpense = ExpensesSQL()
        newExpense.FromJson(ex)
        db.session.add(newExpense)
        db.session.commit()
    else :
        ex['mongo']  = False
        newExpense = ExpensesSQL()
        newExpense.FromJson(ex)
        db.session.add(newExpense)
        db.session.commit()

def getTotalofData(data):
    products = []
    productsCount = {}
    for row in data :
        if row.name not in products :
            products.append(row.name)
    for pap in products :
        count = 0
        for row in data : 
            if row.name == pap :
                cost = [float(s) for s in row.cost.split() if s.replace('.','',1).isdigit()]
                print(row.cost.split())
                count += int(cost[0])
        productsCount[pap] = count

    return productsCount


def UpdateRecipts(llist):
    for r in llist:
        newRecipt = ReciptsSQL()
        rdict = r.__dict__
        rdict["mongo"] = True
        newRecipt.FromJson(rdict)
        db.session.add(newRecipt)
        db.session.commit()


def gatherShift(obj):
    lastBox = db.session.query(ShiftSQL).get(int(obj['from'])).box
    total = {}
    total[obj['from']] = lastBox
    for i in range(1  , int(obj['to']) + 1  ):
        thisBox = db.session.query(ShiftSQL).get(int(obj['from']) - i).box
        lastBox += thisBox
        total[str(int(obj['from']) - i)] = thisBox
    total['Total'] = lastBox
    return total
def connected_to_internet(url='http://www.google.com/', timeout=5):
    try:
        _ = requests.head(url, timeout=timeout)
        return True
    except requests.ConnectionError:
        return False
