from time import strftime
from playstation import app , cID
from playstation.Objects.Design.frontend import Front as fr
from .forms import Login
from .functions import AddReciptToDataBase ,flipArray, makeAnotherShift,ReturnReport2,ReturnReport, getTotalOfThis ,getTotalOfbuy, expensesOperations
from flask import render_template , redirect , url_for,request, session
from .models import Shifts, services , products,users, msg , Recipts , expenses , colors
import random


@app.route('/' , methods=['POST','GET'])
@app.route('/login' , methods=['POST','GET'])
def login():
    if session.get('login_user') is not None:
        return redirect(url_for('dashboard'))
    filesCss = fr.Getcss('login')
    filesJs = fr.Getjs()
    form = Login()
    if form.validate_on_submit():
        user = users.find_one({'n' : form.n.data})
        session['login_user'] = {'n' : form.n.data , 'id' : user['_id']}
        return redirect(url_for('dashboard'))
    if form.errors:
        for errorfield in form.errors:
            for errorM in form[errorfield].errors:
                errorC = errorM
                return render_template('login.html', errorM=errorC, form=form , css=filesCss , js=filesJs )
    return render_template('login.html' , css=filesCss , js=filesJs , form=form)

@app.route('/dashboard' , methods=['POST','GET'])
def dashboard():
    filesCss = fr.Getcss('dashboard')
    filesJs = fr.Getjs('helpers/url.js','routes.js','components/service.js','components/product.js','settings.js','helpers/reciptState.js','reciptandservics.js',
                       'helpers/DateFormatting.js','components/message.js' , 'excel.js' , 'components/buy.js')
    Sservices = flipArray(list(services.find()) , 'S-name' , 'بوفيه')
    Pproducts = products.find()
    Sshifts = list(Shifts.find())
    lastShift = Sshifts[len(Sshifts) - 1]
    r = list(Recipts.find({'ShiftNumber' : lastShift['_id']}))
    user_name = users.find_one({'_id' : session['login_user']['id']})['username']
    totalInReport = getTotalOfThis(r , 'total' , 'dis')
    expense = list(expenses.find())
    expensesTotal = getTotalOfbuy(expense , 'v')
    mycolors = list(colors.find())[0]
    return render_template('dashboard.html',mycolors=mycolors,expense=expense, expensesTotal=expensesTotal ,user_name=user_name,totalInReport=totalInReport ,r=r,css=filesCss, lastShift=lastShift ,js=filesJs, Service = Sservices , Products=Pproducts)


@app.route('/Excel' , methods=['POST','GET'])
def Excel():
    valOBJ = request.get_json()
    val = ReturnReport(valOBJ)
    totalInReport = getTotalOfThis(val, 'total' , 'dis')
    return render_template('components/Reports.html', totalInReport=totalInReport , r = val)

@app.route('/Excel2' , methods=['POST','GET'])
def Excel2():
    valOBJ = request.get_json()
    val = ReturnReport2(valOBJ)
    expensesTotal = getTotalOfbuy(val, 'v')
    return render_template('components/expenses.html', expensesTotal=expensesTotal , r = val)

@app.route('/AddService' , methods=['POST','GET'])
def addService():
    service = request.get_json()
    service['_id'] = random.randint(0,100000)
    services.insert_one(service)
    return {'msg' : "تم اضافة الخدمة" , 'id' : service['_id']}

@app.route('/AddProduct' , methods=['POST','GET'])
def addProduct():
    product = request.get_json()
    product['_id'] = random.randint(0,100000)
    products.insert_one(product)
    return 'تم اضافة المنتج'

@app.route('/R_Detail/<int:id>' , methods=['POST','GET'])
def R_Detail(id):
    thisR = Recipts.find_one({'_id' : id})
    return render_template('one.html' , r = thisR)

@app.route('/AddMessage' , methods=['POST','GET'])
def addMessage():
    Message = request.get_json()
    Message['_id'] = random.randint(0,100000)
    msg.insert_one(Message)
    return 'تم اضافة الرسالة'

@app.route('/AddBuy' , methods=['POST','GET'])
def AddBuy():
    expense = request.get_json()
    print(expense)
    expense['_id'] = random.randint(0,100000)
    expensesOperations(expense)
    return 'تم اضافة المصروف'

@app.route('/lockDevice' , methods=['POST','GET'])
def lockDevice():
    service = request.get_json()
    services.update_one({'_id' : service['id']} , {
    '$set' : {
        'S-status' : 'locked'
    }
    })
    return 'تم الحجز'


@app.route('/unlockDevice' , methods=['POST','GET'])
def unlockDevice():
    service = request.get_json()
    services.update_one({'_id' : service['id']} , {
    '$set' : {
        'S-status' : 'available'
    }
    })
    return 'تم الغاء الحجز'


@app.route('/StartDevice' , methods=['POST','GET'])
def StartDevice():
    service = request.get_json()
    services.update_one({'_id' : service['id']} , {
    '$set' : {
        'S-status' : 'busy'
    }
    })
    return 'تم بدأ الفاتورة'

@app.route('/EndDevice' , methods=['POST','GET'])
def EndDevice():
    recipt = request.get_json()
    BR = AddReciptToDataBase(recipt)
    BR['msg'] = 'تم انهاء الفاتورة'
    return BR


@app.route('/EndShift')
def EndShift():
    makeAnotherShift()
    return redirect(url_for('logout'))

@app.route('/changecolor' , methods=['POST','GET'])
def changecolor():
    obj = request.get_json()
    colors.update_one({'_id' : cID} , {
        '$set' : {
            'avacolor' : obj['avacolor'],
            'lockcolor' : obj['lockcolor'],
            'busycolor' : obj['busycolor']
        }
    })
    return 'تم تغيير الالوان'

@app.route('/logout')
def logout():
    session.pop('login_user', None)
    return redirect(url_for('login'))

from playstation import api