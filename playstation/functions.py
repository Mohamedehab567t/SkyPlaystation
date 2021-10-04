from .models import users,services , Shifts ,Recipts,msg,expenses
from wtforms.validators import ValidationError
from flask import render_template
import random
import dateutil.parser
def Validate_account(self, n):
    user = users.find_one({'n': n.data})
    if not user:
        raise ValidationError('لا يوجد مستخدم')
    
def Validate_password(self, password):
    user = users.find_one({'n': self.n.data})
    if not user:
        raise ValidationError('لا يوجد مستخدم')
    else:
        if user['password'] != password.data:
            raise ValidationError('خطأ في كلمة المرور')
        

def AddReciptToDataBase(obj) :
    obj['_id'] = random.randint(0,100000000)
    serviceName = services.find_one({'_id' : obj['ServiceID']})
    obj['serviceName'] = serviceName['S-name']
    Sshifts = list(Shifts.find())
    lastShift = Sshifts[len(Sshifts) - 1]
    obj['ShiftNumber'] = lastShift['_id']
    obj['serachDate'] = dateutil.parser.parse(obj['serachDate'])
    lastShiftBox = lastShift['box']
    lastShiftRecipts = lastShift['R_count']
    obj['R_n'] = lastShiftRecipts + 1
    services.update_one({'_id' : obj['ServiceID']} , {
    '$set' : {
        'S-status' : 'available'
    }
    })
    Shifts.update_one({'_id' : lastShift['_id']}, {
        '$set' : {
            'box' : lastShiftBox + obj['total'],
            'TH' : lastShift['TH'] + obj['totalS'],
            'TP' : lastShift['TP'] + obj['totalP'] ,
            'R_count' : lastShiftRecipts + 1
        }
    })
    Recipts.insert_one(obj)
    msgg = msg.find()
    temp = render_template('components/Fatora.html' , obj=obj, lastShiftRecipts=lastShiftRecipts , serviceName=serviceName , msgg=msgg)
    return {'box' : lastShift['box'] , 'R_count' : lastShift['R_count'] , 'temp' : temp}

def makeAnotherShift():
    Sshifts = list(Shifts.find())
    lastShift = Sshifts[len(Sshifts) - 1]
    lastID = lastShift['_id']
    Shifts.insert_one({'_id' : lastID + 1 , 'box' : 0 , 'R_count' : 0 , 'buy' : 0 , 'TH' : 0 , 'TP' : 0})
    
    
def ReturnReport(val):
    AndExpressionForS = []
    for obj in val:
        if 'serachDate' in obj:
            expression = {str(obj): {
            '$lt': dateutil.parser.parse(val[obj][1]),
            '$gte': dateutil.parser.parse(val[obj][0])
            }}
            AndExpressionForS.append(expression)
        else :
            expression = {str(obj): val[obj]}
            AndExpressionForS.append(expression)
    Report = list(Recipts.find({
        '$and' : AndExpressionForS
    }))
    return Report

def ReturnReport2(val):
    AndExpressionForS = []
    for obj in val:
        if 'serachDate' in obj:
            expression = {str(obj): {
            '$lt': dateutil.parser.parse(val[obj][1]),
            '$gte': dateutil.parser.parse(val[obj][0])
            }}
            AndExpressionForS.append(expression)
        else :
            expression = {str(obj): val[obj]}
            AndExpressionForS.append(expression)
    print(AndExpressionForS)
    Report = list(expenses.find({
        '$and' : AndExpressionForS
    }))
    print(Report)
    return Report

def getTotalOfThis(arr , Val1 , Val2):
    total = {}
    total['safy'] = 0
    total['dis'] = 0
    for t in arr:
        total['safy'] += t[Val1]
        total['dis'] += t[Val2]
    total['total'] = total['safy'] + total['dis']
    return total

def getTotalOfbuy(arr , Val1):
    total = {}
    total['t'] = 0
    for t in arr:
        total['t'] += int(t[Val1])
    return total

def expensesOperations(ex):
    Sshifts = list(Shifts.find())
    lastShift = Sshifts[len(Sshifts) - 1]
    lastShiftBox = lastShift['box']
    lastShiftBuy = lastShift['buy']
    Shifts.update_one({'_id' : lastShift['_id']}, {
        '$set' : {
            'buy' : int(ex['v']) + lastShiftBuy
        }
    })
    ex['s'] = dateutil.parser.parse(ex['s'])
    ex['sn'] = lastShift['_id']
    ex['v'] = int(ex['v'])
    expenses.insert_one(ex)
    
    
def DO(shift):
    Sshifts = list(Shifts.find())
    lastShift = Sshifts[len(Sshifts) - 1]
    R = list(Recipts.find({'ShiftNumber' : lastShift['_id']}))
    p = 0
    h = 0
    for r in R:
        print('S total' + str(r['totalS']))
        p += r['totalP']
        h += r['totalS']
        print('h total '+str(h))
    Shifts.update_one({'_id' : shift['_id']} , {
        '$set' : {
            'TH' : h,
            'TP' : p 
        }
    })