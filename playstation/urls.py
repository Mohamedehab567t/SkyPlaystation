from re import I
from time import strftime
from playstation import app , db
from playstation.Objects.Design.frontend import Front as fr
from .forms import Login
from .functions import AddReciptToDataBase , ReturnReport3 , gatherShift , getTotalOfThisSearch , getTotalofData  , UpdateRecipts, makeAnotherShift,ReturnReport2,ReturnReport, getTotalOfThis ,getTotalOfbuy, expensesOperations , connected_to_internet
from flask import render_template , redirect , url_for,request, session
from .models import  ConnectToServer
import random
from .Reports import GetReports , GetReport
from .database import DrawnSql, ReciptsSQL, ShiftSQL , servicesSQL , ColorsSQL , ExpensesSQL , ProductsSQL , msgSQL , CustomerSQL , UserSQL , RulsSql
import json
import datetime
import sqlalchemy

@app.route('/' , methods=['POST','GET'])
@app.route('/login' , methods=['POST','GET'])
def login():
    if session.get('login_user') is not None:
        return redirect(url_for('dashboard'))
    filesCss = fr.Getcss('login')
    filesJs = fr.Getjs()
    form = Login()
    if form.validate_on_submit():
        user = db.session.query(UserSQL).filter(UserSQL.name == form.n.data).first()
        session['login_user'] = {'n' : form.n.data , 'state' : user.state}
        return redirect(url_for('dashboard'))
    if form.errors:
        for errorfield in form.errors:
            for errorM in form[errorfield].errors:
                errorC = errorM
                return render_template('login.html', errorM=errorC, form=form , css=filesCss , js=filesJs )
    return render_template('login.html' , css=filesCss , js=filesJs , form=form)

@app.route('/dashboard' , methods=['POST','GET'])
def dashboard():
    filesCss = fr.Getcss('dashboard' , 'bootstrap-icons')
    filesJs = fr.Getjs('helpers/url.js','routes.js','components/service.js','components/product.js','settings.js','helpers/reciptState.js','reciptandservics.js',
                       'helpers/DateFormatting.js','components/message.js' , 'excel.js' , 'components/buy.js' , 'components/user.js')
    Sservices = list(servicesSQL.query.all())
    Pproducts = list(ProductsSQL.query.all())
    Sshifts = list(ShiftSQL.query.all())
    Reciptss = list(ReciptsSQL.query.all())
    Userss = list(UserSQL.query.all())
    ShiftObj = Sshifts[len(Sshifts) - 1]
    lastShift = ShiftObj.__dict__
    r = GetReports()
    totalInReport = getTotalOfThis(r)
    expense = list(ExpensesSQL.query.all())
    expensesTotal = getTotalOfbuy(expense , 'v')
    customers = list(CustomerSQL.query.all())
    msgs = list(msgSQL.query.all())
    rules = list(RulsSql.query.all())
    mycolors = list(ColorsSQL.query.all())[0]
    userState = session['login_user']
    return render_template('dashboard.html',mycolors=mycolors,rules=rules,expense=expense, msgs=msgs ,userState=userState , Userss=Userss ,Reciptss=Reciptss,customers=customers ,expensesTotal=expensesTotal ,totalInReport=totalInReport ,r=r,css=filesCss, lastShift=lastShift ,js=filesJs, Service = Sservices , Products=Pproducts)



@app.route('/Excel' , methods=['POST','GET'])
def Excel():
    valOBJ = request.get_json()
    val = ReturnReport(valOBJ)
    totalInReport = getTotalOfThisSearch(val)
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
    newService = servicesSQL()
    newService.FromJson(service)
    db.session.add(newService)
    db.session.commit()
    return {'msg' : "تم اضافة الخدمة" , 'id' : service['_id']}

@app.route('/AddProduct' , methods=['POST','GET'])
def addProduct():
    product = request.get_json()
    product['_id'] = random.randint(0,100000)
    newProduct = ProductsSQL()
    newProduct.FromJson(product)
    db.session.add(newProduct)
    db.session.commit()
    return 'تم اضافة المنتج'

@app.route('/R_Detail/<int:id>' , methods=['POST','GET'])
def R_Detail(id):
    thisR = GetReport(id)
    return render_template('one.html' , r = thisR)



@app.route('/AddCustomer' , methods=['POST','GET'])
def AddCustomer():
    Custome = request.get_json()
    Custome['_id'] = random.randint(0,100000)
    newProduct = CustomerSQL()
    newProduct.FromJson(Custome)
    db.session.add(newProduct)
    try:
        db.session.commit()
    except sqlalchemy.exc.IntegrityError as ex :
        return 'هذا العميل متواجد بالفعل'
    return 'تم اضافة العميل'

@app.route('/addrule' , methods=['POST','GET'])
def addrule():
    Rule = request.get_json()
    newRule = RulsSql()
    newRule.FromJson(Rule)
    db.session.add(newRule)
    db.session.commit()
    return 'تم اضافة القاعدة'

@app.route('/AddMessage' , methods=['POST','GET'])
def addMessage():
    Message = request.get_json()
    Message['_id'] = random.randint(0,100000)
    newProduct = msgSQL()
    newProduct.FromJson(Message)
    db.session.add(newProduct)
    db.session.commit()
    return 'تم اضافة الرسالة'

@app.route('/AddUser' , methods=['POST','GET'])
def addUser():
    User = request.get_json()
    newUser = UserSQL()
    newUser.FromJson(User)
    db.session.add(newUser)
    db.session.commit()
    return 'تم اضافة المستخدم'


@app.route('/ModifyUser' , methods=['POST','GET'])
def modifyUser():
    User = request.get_json()
    newUser = UserSQL()
    newUser.UpdateUser(User['id'] , User['name'] , User['password'] , User['state'])
    db.session.commit()
    return 'تم تعديل المستخدم'

@app.route('/AddBuy' , methods=['POST','GET'])
def AddBuy():
    expense = request.get_json()
    expense['_id'] = random.randint(0,100000)
    expensesOperations(expense)
    return 'تم اضافة المصروف'

@app.route('/lockDevice' , methods=['POST','GET'])
def lockDevice():
    service = request.get_json()
    updatedService = servicesSQL()
    updatedService.updateStatus(service['id'] , "locked")
    db.session.commit()
    return 'تم الحجز'


@app.route('/unlockDevice' , methods=['POST','GET'])
def unlockDevice():
    service = request.get_json()
    updatedService = servicesSQL()
    updatedService.updateStatus(service['id'] , "available")
    db.session.commit()
    return 'تم الغاء الحجز'


@app.route('/StartDevice' , methods=['POST','GET'])
def StartDevice():
    service = request.get_json()
    updatedService = servicesSQL()
    updatedService.updateStatus(service['id'] , "busy")
    db.session.commit()
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

"""@app.route('/changecolor' , methods=['POST','GET'])
def changecolor():
    obj = request.get_json()
    colors.update_one({'_id' : cID} , {
        '$set' : {
            'avacolor' : obj['avacolor'],
            'lockcolor' : obj['lockcolor'],
            'busycolor' : obj['busycolor']
        }
    })
    return 'تم تغيير الالوان'"""


@app.route('/getinfo' , methods=['POST','GET'])
def get_info():
    json = request.get_json()
    service = db.session.query(servicesSQL).get(int(json['id']))
    filesJs = fr.Getjs()
    return render_template("form.html" , service=service.__dict__ , js=filesJs)

@app.route('/updateDevice' , methods=['POST','GET'])
def updateDevice():
    json = request.get_json()
    updatedService = servicesSQL()
    updatedService.updatemain(int(json['id']), json['name'] , json['price'] , json['multi'])
    db.session.commit()
    return "done"

@app.route('/deleteDevice' , methods=['POST','GET'])
def deleteDevice():
    json = request.get_json()
    db.session.query(servicesSQL).filter(servicesSQL._id==int(json['id'])).delete()
    db.session.commit()
    return "done"


@app.route('/refreshDevices' , methods=['POST','GET'])
def refreshDevices():
    json = request.get_json()
    Sservices = list(servicesSQL.query.all())
    mycolors = list(ColorsSQL.query.all())[0]
    expense = list(ExpensesSQL.query.all())
    Sshifts = list(ShiftSQL.query.all())
    ShiftObj = Sshifts[len(Sshifts) - 1]
    lastShift = ShiftObj.__dict__
    expensesTotal = getTotalOfbuy(expense , 'v')
    Pproducts = list(ProductsSQL.query.all())
    Reciptss = list(ReciptsSQL.query.all())
    userState = session['login_user']
    return render_template("components/"+json['template']+".html" , userState=userState , Pproducts=Pproducts ,Reciptss=Reciptss,Service = Sservices , mycolors=mycolors , expense=expense , lastShift=lastShift , expensesTotal = expensesTotal)



@app.route('/sendRecipts' , methods=['POST','GET'])
def sendRecipts():
    if connected_to_internet():
        Rlist = list(db.session.query(ReciptsSQL).filter(ReciptsSQL.mongo == 0 ))
        db.session.query(ReciptsSQL).filter(ReciptsSQL.mongo == 0 ).delete()
        db.session.commit()
        for r in Rlist :
            rdict = r.__dict__
            rdict.pop("_sa_instance_state" , None)
            rdict['history'] = json.loads(rdict['history'])
            rdict['products'] = json.loads(rdict['products'])
            rdict['_id'] = random.randint(0,999999)
            rdict['serachDate'] = datetime.datetime.combine(rdict['serachDate'], datetime.time.min)
            Recipts = ConnectToServer()
            Recipts.insert_one(rdict)
        UpdateRecipts(Rlist)
        return "تم الارسال"
    else:
        return "من فضلك اتصل بالانترنت"






# روابط ادارة المخازن 

@app.route('/manage')
def manage():
    filesCss = fr.Getcss()
    filesJs = fr.Getjs()
    return render_template("manage.html" , css=filesCss , js=filesJs)


@app.route('/add')
def add():
    filesCss = fr.Getcss()
    filesJs = fr.Getjs('components/product.js','add.js')
    return render_template("components/AddProduct.html" , css=filesCss , js=filesJs)


@app.route('/ReportDrawn')
def reportdrawn():
    filesCss = fr.Getcss('dashboard')
    filesJs = fr.Getjs('searchdrawn.js')
    Sshifts = list(ShiftSQL.query.all())
    ShiftObj = Sshifts[len(Sshifts) - 1]
    lastShift = ShiftObj.__dict__
    products = list(ProductsSQL.query.all())
    rlist = list(db.session.query(DrawnSql).filter(DrawnSql.shiftnumber == lastShift['id'] ))
    total = getTotalofData(rlist)
    return render_template("components/DrawnProduct.html", total=total , rlist=rlist, products=products , css=filesCss , js=filesJs)

@app.route('/modify')
def modify():
    filesCss = fr.Getcss()
    filesJs = fr.Getjs('components/product.js','modify.js')
    Pproducts = list(ProductsSQL.query.all())
    return render_template("components/ModifyProduct.html" , css=filesCss,Pproducts=Pproducts , js=filesJs)


@app.route('/modifyProduct/<int:id>' , methods=['POST','GET'])
def modifyProduct(id):
    filesCss = fr.Getcss()
    filesJs = fr.Getjs('components/product.js','modify.js')
    product = db.session.query(ProductsSQL).filter(ProductsSQL._id == id ).first()
    return render_template("components/ModifyProductForm.html" , css=filesCss,product=product , js=filesJs)


@app.route('/modifyProductStorage/<int:id>' , methods=['POST','GET'])
def modifyProductstorage(id):
    filesCss = fr.Getcss()
    filesJs = fr.Getjs('components/product.js','modify.js')
    product = db.session.query(ProductsSQL).filter(ProductsSQL._id == id ).first()
    return render_template("components/ModifyProductStorage.html" , css=filesCss,product=product , js=filesJs)

@app.route('/ModifyProductData' , methods=['POST','GET'])
def modifyProductData():
    obj = request.get_json()
    product = ProductsSQL()
    product.Upadate(obj['id'] , obj['name'] , obj['price'])
    db.session.commit()
    return "تم تعديل المنتج"

@app.route('/modifyProductStorageData' , methods=['POST','GET'])
def modifyProductstoragedata():
    obj = request.get_json()
    product = ProductsSQL()
    product.UpdateStorage(obj['id'] , obj['addstorage'])
    db.session.commit()
    return "تم تعديل المنتج"

@app.route('/Excel3' , methods=['POST','GET'])
def Excel3():
    valOBJ = request.get_json()
    val = ReturnReport3(valOBJ)
    total = getTotalofData(val)
    return render_template('components/drwans.html', total=total , r = val)


@app.route('/CalculateShifts' , methods=['POST','GET'])
def CalculateShifts():
    obj = request.get_json()
    try:
        returned = gatherShift(obj)
    except AttributeError :
        return "ﻻ يمكن حساب هذه العملية"
    return returned


@app.route('/messageUpdate' , methods=['POST','GET'])
def messageUpdate():
    id = request.form.get("id")
    message = request.form.get("m")
    msg = msgSQL()
    msg.update(id , message)
    db.session.commit()
    return redirect(url_for("dashboard"))

@app.route('/ruleUpdate' , methods=['POST','GET'])
def ruleUpdate():
    id = request.form.get("id")
    c = request.form.get("c")
    v = request.form.get("v")
    rule = RulsSql()
    rule.update(id , c , v)
    db.session.commit()
    return redirect(url_for("dashboard"))

@app.route('/updatespecial' , methods=['POST','GET'])
def updatespecial():
    id = request.form.get("id")
    message = request.form.get("spe")
    special = CustomerSQL()
    special.Updatespecial(id , message)
    db.session.commit()
    return redirect(url_for("dashboard"))

@app.route('/deleteProduct/<int:id>' , methods=['POST','GET'])
def deleteProduct(id):
    db.session.query(ProductsSQL).filter(ProductsSQL._id==int(id)).delete()
    db.session.commit()
    return redirect(url_for('modify'))

@app.route("/tst")
def tst():
    customers = list(CustomerSQL.query.all())
    ids = {}
    for t in customers :
        name = t.name
        idss = []
        for o in customers :
            if o.name == name and o._id != t._id:
                idss.append(o._id)
                idss.append(t._id)
                print(o.name)
        if len(idss) > 0: 
            ids[name] = idss
    return ids


@app.route('/logout')
def logout():
    session.pop('login_user', None)
    return redirect(url_for('login'))