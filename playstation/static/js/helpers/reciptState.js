class rState {
    constructor(ele){
        this.ele = ele
    }
    ChangeState(element){
        this.ele ? $(element).show() : $(element).hide()
        if (this.ele == false){$('#nameOfDevice').text('')} 
    }
    showRelatedRecipt(prev , selected , element){
        if(prev == 0 || prev == selected){
            this.ele ? this.ele = false  : this.ele = true;
            this.ChangeState(element)
            let state = localStorage.getItem('D'+selected)
            this.checkRecipptState(state , selected , element)
            if (this.ele == false){$('#nameOfDevice').text('')}
            
        }else{
            $(element).hide()
            let state = localStorage.getItem('D'+selected)
            this.checkRecipptState(state , selected , element)
            $(element).show()
            this.ele = true
        }
    }
    checkRecipptState(state = '' , selected,element){
        switch (state) {
            case 'available':
                this.avaialableRecipt(selected,element)
                break;
            case 'locked':
                this.lockedRecipt(selected,element)
                break;
            case 'busy':
                this.busyRecipt(selected)
                break;
            default:
                break;
        }
    }

    // RECIPT STATE
    avaialableRecipt(selected , element){
        let Start = $('#StartRecipt')
        $(Start).show()
        let device = $('#D'+selected)
        let nameOfDevice = $(device).find('#name').text()
        let buttonOfStart = $(element).find('#StartR')
        $(buttonOfStart).data('id' ,parseInt(selected) )
        let buttonOflock = $(element).find('#LockR')
        buttonOflock.text('حجز')
        buttonOflock.removeClass('UNL').addClass('L')
        $(buttonOflock).data('id' , parseInt(selected))
        buttonOfStart.text('أبدء فاتورة ل '+nameOfDevice)
    }

    lockedRecipt(selected,element){
        let Start = $('#StartRecipt')
        $(Start).show()
        let device = $('#D'+selected)
        let nameOfDevice = $(device).find('#name').text()
        let buttonOfStart = $(element).find('#StartR')
        $(buttonOfStart).data('id' ,parseInt(selected) )
        let buttonOflock = $(element).find('#LockR')
        buttonOflock.text('الغاء الحجز')
        buttonOflock.removeClass('L').addClass('UNL')
        $(buttonOflock).data('id' , parseInt(selected))
        buttonOfStart.text('أبدء فاتورة ل '+nameOfDevice)
    }

    busyRecipt(id){
        let Start = $('#StartRecipt')
        this.refreshDiv('tablecon' , 'ProducTabels')
        let thisServiceRecipt = JSON.parse(localStorage.getItem('R'+id))
        this.buildMyRecipt(thisServiceRecipt)
        $(Start).hide()
    }

    //BTN FUNCTIONS
    lockDevice(id , ele , f1){
        const msg =
        {
           'id' : id
        }
        $.ajax({
            type: 'POST',
            url: '/lockDevice',
            data: JSON.stringify(msg),
            contentType: 'application/json;charset=UTF-8',
            beforeSend : function(){
            $(ele).text('جاري ...')
            $(ele).prop('disabled' , true)
            },
            complete: function(){
            $(ele).text('الغاء الحجز')
            },
            success : function(data){
                alert(data)
                $(ele).prop('disabled' , false)
                $(ele).removeClass('L').addClass('UNL')
                f1('TableCon' , 'S-Table')
                localStorage.setItem('D'+id , 'locked')
            },
            error : function(errmsg) {
                alert(errmsg)
            }
            });
    }
    unlockDevice(id , ele , f1){
        const msg =
        {
           'id' : id
       }
        $.ajax({
            type: 'POST',
            url: '/unlockDevice',
            data: JSON.stringify(msg),
            contentType: 'application/json;charset=UTF-8',
            beforeSend : function(){
            $(ele).text('جاري ...')
            $(ele).prop('disabled' , true)
            },
            complete: function(){
            $(ele).text('حجز')
            },
            success : function(data){
                alert(data)
                $(ele).prop('disabled' , false)
                $(ele).removeClass('UNL').addClass('L')
                f1('TableCon' , 'S-Table')
                localStorage.setItem('D'+id , 'available')
            },
            error : function(errmsg) {
                alert(errmsg)
            }
            });
    }

    StartDevice(id , ele , f1 , price , multiplePrice){
        const msg =
        {
           'id' : id
       }
       let ThisClass = this
        $.ajax({
            type: 'POST',
            url: '/StartDevice',
            data: JSON.stringify(msg),
            contentType: 'application/json;charset=UTF-8',
            beforeSend : function(){
            $(ele).text('جاري ...')
            $(ele).prop('disabled' , true)
            },
            success : function(data){
                f1('TableCon' , 'S-Table')
                $(ele).prop('disabled' , false)
                ThisClass.refreshDiv('tablecon' , 'ProducTabels')
                let newDate = new Date()
                let ReciptOBJ = {
                    "history" : [],
                    "startTime" :newDate.toString() ,
                    "totalnum" : 0,
                    "totalHours" : 0,
                    "totalProducts" : 0,
                    "restnum" : 0,
                    "purchased" : 0,
                    "EndHours" : 0,
                    "products" : [],
                    "discount" : 0,
                    "price" : price,
                    "benchPrice" : multiplePrice,
                    "price_type" : "S",
                    "joystick_count" : "two",
                    "sid" : id
                }
                console.log(ReciptOBJ)
                let d = new Date()
                ReciptOBJ.history.push('تم بدأ الفاتورة في '+ d.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm# #AMPM#"))
                localStorage.setItem('R'+id, JSON.stringify(ReciptOBJ))
                localStorage.setItem('D'+id , 'busy')
                ThisClass.busyRecipt(id)
            },
            error : function(errmsg) {
                alert(errmsg)
            }
            });
    }

    //Refresh
    refreshDiv(parentID = "",childID = ""){
        $.ajax({
            type: 'POST',
            url: '/refreshDevices',
            data: JSON.stringify({"template" :  childID}),
            contentType: 'application/json;charset=UTF-8',
            success : function(data){
                $("#"+parentID).html(data)
            },
            error : function(errmsg) {
                alert(errmsg)
            }
            });    }
    //Building Recipt
    buildMyRecipt(obj){
        // get History
      //  let history =  $('#movement')
      //  $(history).empty()
      //  obj['history'].forEach(e => {
      //      let Paragraph = document.createElement('p')
      //      $(Paragraph).attr('class' , 'one-record')
      //      $(Paragraph).text(e)
      //      $(history).append(Paragraph)
      //  });

        // get time
        let consumedTime = $('#consumedTime')
        let currentDate = new Date()
        let Dobj = this.returnInHours(Date.parse(currentDate) , Date.parse(obj['startTime']))
        let NowPrice = parseFloat(Dobj['H']) * parseInt(obj['price'])
        obj['totalHours'] =  NowPrice
        $(consumedTime).text(Dobj['h'] + ' ساعة ' +Dobj['m'] + ' دقيقة'+' = ' + NowPrice.toFixed(0) + ' ج ') 

        if($('#D'+obj['sid']).find('#name').text() == 'بوفيه'){
            $(consumedTime).text('') 
        }
        //Write What Habbend
        let device = $('#D'+obj['sid'])
        $('#nameOfDevice').text($(device).find('#name').text())

        //set Discount
        $('#Bdiscount').attr('class' , '')
        $('#Bdiscount').addClass('R'+obj['sid'])
        obj['totalnum'] = obj['totalnum'] - obj['discount']


        // set customer
        $('#customeriNPUT').attr('class' , '')
        $('#customeriNPUT').addClass('R'+obj['sid'])
        $("#customerdis").text('ﻻ يوجد خصم مميز')
        if(obj['customer'] != undefined){
            $('#customeriNPUT').val(obj['customer']['name'])
            $('#customerinfos').text(`العميل ${obj['customer']['name']} شارك في ${obj['customer']['rn']} فاتورة وادخل للمكان ${parseInt(obj['customer']['payed'])} ج.م`)
            if(obj['specialDis'] != undefined){
                $("#customerdis").text(`تم تفعيل خصم مميز بقيمة ${parseFloat(obj['specialDis']) * 100}%  للعميل`)
            }
        }else{
            $('#customeriNPUT').val('')
            $('#customerinfos').text('يعرض هنا بيانات العميل')

        }
        

        //set Products
        $('#tablecon').attr('class' , '')
        $('#tablecon').addClass('R'+obj['sid'])
        $('#ReciptTableC').attr('class' , '')
        $('#ReciptTableC').addClass('R'+obj['sid'])
        this.createRow(obj)
        
        //SetTotal
        this.setTotal(obj)

        //Set Purchase
        this.setRest(obj)

        //Set Price type 
        $("#SD").val(obj["price_type"])
        $("#SD").attr('class' , '')
        $("#SD").addClass('R'+obj['sid'])


        // set joystick count
        $("#joycount").val(obj["joystick_count"])
        $("#joycount").attr('class' , '')
        $("#joycount").addClass('R'+obj['sid'])

        //make End Recipt ready
        $('#endOfRecipt').attr('class' , 'btn btn-danger')
        $('#endOfRecipt').addClass(''+obj['sid'])

        //make interval ready
        $('#time').val('')
        $('#alarm').data('c' , '')
        $('#alarm').data('c' , obj['sid'])
        $('#disalarm').data('c' , '')
        $('#disalarm').data('c' , obj['sid'])
        
        if(obj['type'] != undefined){
            if(obj['type'] == 'withTime'){
                $('#disalarm').attr('style' , 'display:inline !important')
                $('#alarm').attr('style' , 'display:none !important')
            }else{
                $('#alarm').attr('style' , 'display:inline !important')
                $('#disalarm').attr('style' , 'display:none !important')
            }
        }else{
            $('#alarm').attr('style' , 'display:inline !important')
            $('#disalarm').attr('style' , 'display:none !important')
        }
    } 
    returnInHours(n1 , n2){
        let hours = ((n1 - n2) / 1000 / 60)  / 60
        let minutes = ((n1 - n2) / 1000 / 60) % 60
        return {'h' : parseInt(hours) , 'm' : minutes.toFixed(0) , 'H' : hours.toFixed(3)}
    }


    // addProduct 
    addProductToTheRecipt(Button){
        let tableRow = $(Button).closest('tr')
        let pInfo = Array.from($(tableRow).children('td'))
        let R = $('#tablecon').attr('class')
        let obj = JSON.parse(localStorage.getItem(R))
        let productOBJ= {
            'name' : pInfo[0].innerText,
            'price' : pInfo[1].innerText,
            'quantity' : 1,
            'total' : pInfo[1].innerText,
            'pid' : $(Button).attr('id')
        }
        let isHere = false
        obj['products'].forEach(e => {
            if(e.pid == productOBJ.pid){
                isHere = true
            }
        })
        if(isHere){
            alert("هذا المنتج متواجد بالفعل في الفاتورة")
        }else{
            obj['products'].push(productOBJ)
            obj['totalProducts'] = obj['totalProducts'] + parseInt(pInfo[1].innerText.split(' ')[0])
        
            let d = new Date()
            obj['history'].push('تم اضافة '+  pInfo[0].innerText + ' في ' + d.customFormat("#AMPM# #hh#:#mm# "))
    
    
            localStorage.setItem(R , JSON.stringify(obj))
            this.buildMyRecipt(JSON.parse(localStorage.getItem(R)))
        }
        
    }

    //deleteProduct
    deleteProductToTheRecipt(Button){
        let tableRow = $(Button).closest('tr')
        let R = $(Button).attr('id')
        let obj = JSON.parse(localStorage.getItem(R))
        obj['products'] = obj['products'].filter(p => p.pid != $(Button).data('pid'))
        obj['totalProducts'] = obj['totalProducts'] - parseInt($(Button).data('price') * parseInt($(tableRow).find('.quantitybox')[0].value))

        let d = new Date()
        let nameOfP = Array.from($(tableRow).children('td'))[0]
        obj['history'].push('تم حذف '+ $(nameOfP).text() + ' في ' +d.customFormat("#AMPM# #hh#:#mm#"))

        localStorage.setItem(R , JSON.stringify(obj))
        //$('#ReciptTableC').prepend(tableRow)
        this.buildMyRecipt(JSON.parse(localStorage.getItem(R)))
    }

    //createProductRow
    createRow(obj){
        $('#ReciptTableC').empty()
        obj['products'].forEach(e => {
            let tr = document.createElement('tr')
            let name = document.createElement('td')
            let price = document.createElement('td')
            let quantity = document.createElement('td')
            let quantityBox = document.createElement('input')
            let total = document.createElement('td')
            let deleteElement = document.createElement('td')
            $(name).text(e['name'])
            $(price).text(e['price'])
            $(quantityBox).addClass('quantityBox '+e['pid'])
            $(quantityBox).attr('style' , 'width : 40px')
            $(quantityBox).val(e['quantity'])
            $(quantityBox).attr('type' , 'number')
            $(quantity).append(quantityBox)
            $(total).text(e['total'])
            $(total).attr('class' , 'totalP')
            $(deleteElement).append(`<i class="fa fa-minus-circle min" id="R${obj['sid']}" data-pid="${e['pid']}" data-price="${$(total).text().split(" ")[0]}" style="color : red;"></i>`)
            $(tr).append(name)
            $(tr).append(price)
            $(tr).append(quantity)
            $(tr).append(total)
            $(tr).append(deleteElement)
            $('#ReciptTableC').append(tr)
        })
    }

    //Quantity change
    quantityChange(input){
        let total = $(input).closest('td').siblings()[2]
        let price = $(input).closest('td').siblings()[1]
        total.innerText = parseInt($(input).val()) * parseInt(price.innerText.split(' ')[0]) + " ج.م"
        let R = $('#ReciptTableC').attr('class')
        let obj = JSON.parse(localStorage.getItem(R))

        let p_id = parseInt($(input).attr('class').split(' ')[1])
        let thisRecord = obj['products'].findIndex(p => p.pid == p_id )
        obj['products'][thisRecord]['quantity'] = $(input).val()
        obj['products'][thisRecord]['total'] = total.innerText



        let Totals = Array.from($('#ReciptTableC').find('.totalP'))
        obj['totalProducts'] = 0
        Totals.forEach(e => {
            let total = parseInt($(e).text().split(' ')[0])
            obj['totalProducts'] += total
        })
        localStorage.setItem(R , JSON.stringify(obj))
       this.setTotal(JSON.parse(localStorage.getItem(R)))
    }


    // endRecipt
    endRecipt(id){
        let obj = JSON.parse(localStorage.getItem('R'+id))
        let Reiptobj = this.returnReciptObj(obj)
        $.ajax({
            type: 'POST',
            url: '/EndDevice',
            data: JSON.stringify(Reiptobj),
            contentType: 'application/json;charset=UTF-8',
            beforeSend : function(){
            $('#endOfRecipt').text('جاري ...')
            $('#endOfRecipt').prop("disabled" , true)
            },
            complete: function(){
            $('#endOfRecipt').text('انهاء الفاتورة')
            $('#endOfRecipt').prop("disabled" , false)
            },
            success : function(data){
                $('.fatora').html(data['temp'])
                $('#BackDrop').attr('class' , '')
                $('#BackDrop').addClass(''+id)
                $('#BackDrop').attr('style' , 'display : flex !important')
            },
            error : function(errmsg) {
                alert(errmsg)
            }
            });
    }

    setTotal(obj){
        let totlaNum = $('#totlaNum')
        let allNum = $('#allNum')
        let discountNum = $('#discountNum')
        let price = obj['price']
        let Dobj = this.returnInHours(Date.parse(new Date()) , Date.parse(obj['startTime']))
        let NowPrice = parseFloat(Dobj['H']) * parseInt(price)
        obj['totalHours'] =  NowPrice
        if($('#D'+obj['sid']).find('#name').text() == 'بوفيه'){
            obj['totalHours'] = 0
        }
        if(obj['specialDis'] != undefined){
            let toMin = parseFloat(obj['totalHours'] + obj['totalProducts'] - obj['discount'] + obj['restnum']) * parseFloat(obj['specialDis'])
            obj['totalnum'] = parseFloat(obj['totalHours'] + obj['totalProducts'] - obj['discount'] + obj['restnum']) - toMin
        }else{
            obj['totalnum'] = parseFloat(obj['totalHours'] + obj['totalProducts'] - obj['discount'] + obj['restnum']) 
        }
        let AllTotal = obj['totalHours'] + obj['totalProducts'] + obj['restnum']
        localStorage.setItem('R'+obj['sid'] , JSON.stringify(obj))
        $(totlaNum).text('صافي : '+obj['totalnum'].toFixed(0)+'ج')
        $(allNum).text('اجمالي : '+AllTotal.toFixed(0)+'ج')
        $(discountNum).text('خصم : '+obj['discount'].toFixed(0)+'ج')
        this.setRest(obj)
    }
    setRest(obj){
        obj['restnum'] = obj['totalnum'] - obj['purchased']
        $('#Bpurchase').attr('class' , '')
        $('#Bpurchase').addClass('R'+obj['sid'])
        $('#restNum').text('باقي : '+obj['restnum'].toFixed(0) + 'ج')
    }

    //SET CALC FALSE
    setCalc(val){
        this.calc = val
    }
    //ReciptOBJ
    returnReciptObj(obj){
        let StartDate = new Date(Date.parse(obj['startTime'])) 
        let EndDate = new Date()
        let totalService = obj['totalHours']
        let totalProducts = obj['totalProducts']
        let discount = obj['discount']
        let total = obj['totalnum']
        let historyOfRecipt = obj['history']
        let ReciptObj = {
            'totalS' : totalService,
            'totalP' : totalProducts,
            'dis' : discount,
            'total' : total,
            'history' : historyOfRecipt,
            'startDT' : StartDate.customFormat("#hhhh#:#mm#"),
            'startDD' : StartDate.customFormat("#YYYY#/#MM#/#DD#"),
            'endDT' : EndDate.customFormat("#hhhh#:#mm#"),
            'endDD' :EndDate.customFormat("#YYYY#/#MM#/#DD#"),
            'serachDate' :  EndDate.toISOString() ,
            'products' : obj['products'],
            'customer' : $("#customeriNPUT").val(),
            'serviceID' : obj['sid']
        }
        if(obj['discountR'] != undefined){
            ReciptObj['discountR'] = obj['discountR']
        }
        return ReciptObj
        }

        //WhatsAfterReciptEnd
        afterEndOfRecipt(id){
            localStorage.removeItem('R'+id)
            localStorage.setItem('D'+id , 'available')
            $('#BackDrop').attr('style' , 'display : none !important')
            this.ele = false
            this.ChangeState($('.DeviceRecipt'))
            this.refreshDiv('TableCon' , 'S-Table')
            this.refreshDiv('upperinfos' , 'infosinuuper')
            this.refreshDiv("offlinediv" , "offline")
        }
}