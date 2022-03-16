var urlController = new url(null)
const RState = new rState(false)
RState.ChangeState($('.DeviceRecipt'))
let prevChoosed = 0;
$(window).on('click' , function(e){
    if($(e.target).hasClass('ShadowDevice')){
        if(prevChoosed == 0){
            RState.showRelatedRecipt(prevChoosed , $(e.target).attr('id') , $('.DeviceRecipt'))
            prevChoosed = $(e.target).attr('id')
        }else{
            RState.showRelatedRecipt(prevChoosed , $(e.target).attr('id') , $('.DeviceRecipt'))
            prevChoosed = $(e.target).attr('id')
        }
    }else if ($(e.target).hasClass('plus')){
        if($(e.target).data('quantity') == 0){
            alert('الكمية صفر من فضلك اضف مخزون')
        }else{
            RState.addProductToTheRecipt($(e.target))
        }
    }else if ($(e.target).hasClass('min')){
        RState.deleteProductToTheRecipt($(e.target))
    }

    if($(e.target).attr("id") == "sendRecipts"){
        $.ajax({
            type: 'POST',
            url: '/sendRecipts',
            beforeSend : function(){
            $(e.target).text('جاري ...')
            },
            complete: function(){
            $(e.target).text('')
            },
            success : function(data){
                urlController.refreshDiv("offlinediv" , "offline")
                alert(data)
            },
            error : function(errmsg) {
                alert(errmsg)
            }
            });
    }
})




$(window).on('change' , function(e) {
    if($(e.target).hasClass("quantityBox")){
        if($(e.target).val() == '' || $(e.target).val() <= 0){
            $(e.target).val('1')
            RState.quantityChange($(e.target))
        }else{
            RState.quantityChange($(e.target))
        }
    }
})

$(window).on('keyup' , function(e) {
    if($(e.target).hasClass("quantityBox")){
        if($(e.target).val() == '' || $(e.target).val() <= 0){
            $(e.target).val('1')
            RState.quantityChange($(e.target))
        }else{
            RState.quantityChange($(e.target))
        }
    }else if ($(e.target).hasClass("DI")){
        let inp = e.target
        if($(inp).attr('id') == 'discount'){
            if($(inp).val() != ''){
                let v = (parseFloat($(inp).val()) / parseFloat($('#totlaNum').text().split(':')[1].split('ج')[0].trim())) * 100  
                $('#discountpercentage').val(''+v.toFixed(1))    
            }else{
                $('#discountpercentage').val('')    
            }
        }else{
            if($(inp).val() != ''){
                let v = (parseFloat($(inp).val()) / 100) * parseFloat($('#totlaNum').text().split(':')[1].split('ج')[0].trim())  
                $('#discount').val(''+v.toFixed(1))
            }else{
                $('#discount').val('')
            }
        }
    }
})

$(document).ready(function() {
    let devices = Array.from($('.device'))
    let RulesInfos = Array.from($(".rule"))
    devices.forEach(e => {
        localStorage.setItem($(e).attr('id'),$(e).data('status'))
    })
    let Rules = []
    RulesInfos.forEach(e => {
        let count = $(e).data("count")
        let value = $(e).data("value")
        Rules.push({
            'count' : count,
            'value' : value
        })
    })
    localStorage.setItem("rules",JSON.stringify(Rules))
    $('.Loading').attr('style' , 'display : none !important')
})

$('#LockR').on('click' , function(){
    if($(this).hasClass('L')){
        RState.lockDevice($(this).data('id') , $(this),
        urlController.refreshDiv)
    }else if ($(this).hasClass('UNL')){
        RState.unlockDevice($(this).data('id') , $(this),
        urlController.refreshDiv)
    }
})

$('#StartR').on('click' , function() {
    let device = $('#D'+$(this).data('id'))
    RState.StartDevice($(this).data('id') , $(this),
    urlController.refreshDiv , $(device).data('price'), $(device).data('mutli'))
})

$('#search').on('keyup' , function(){
    var Names = Array.from($('#ProducTabels').find('.pName'))
    Names.forEach(e => {
        var IndexOF = e.textContent.trim().indexOf($("#search").val())
            if(IndexOF > -1 ){
            var tr = $(e).closest('tr')
            $(tr).attr('style' , 'display:table-row !important')
            }else if (IndexOF == -1 ){
            var tr = $(e).closest('tr')
            $(tr).attr('style' , 'display:none !important')
            }
        })
})


$('#Bpurchase').on('click' , function(){
    let purchaseValue = $('#purchase').val()
    let R = $(this).attr('class')
    let OBJ = JSON.parse(localStorage.getItem(R))
    if(purchaseValue != ''){
        OBJ['purchased'] = OBJ['purchased'] + parseFloat(purchaseValue)
        OBJ['restnum'] = OBJ['totalnum'] - OBJ['purchased']
        let d = new Date()
        OBJ['history'].push('تم تسديد مبلغ '+  purchaseValue + ' في ' + d.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm# #AMPM#"))
        localStorage.setItem(R , JSON.stringify(OBJ))
        RState.buildMyRecipt(JSON.parse(localStorage.getItem(R)))
    }
    $('#purchase').val('')
})

$('#SD').on('change' , function(){
    let R = $(this).attr('class')
    let OBJ = JSON.parse(localStorage.getItem(R))
    if(OBJ['benchPrice'] != "None"){
        let temp = OBJ['price']
        OBJ['price'] = OBJ['benchPrice']
        OBJ['benchPrice'] = temp
        OBJ['price_type'] = $(this).val()
        localStorage.setItem(R , JSON.stringify(OBJ))
        RState.buildMyRecipt(JSON.parse(localStorage.getItem(R)))
    }else{
        alert("لم يتم تحديد سعر المالتي علي هذا الجهاز")
    }

})

$('#joycount').on('change' , function(){
    let R = $(this).attr('class')
    let OBJ = JSON.parse(localStorage.getItem(R))
    OBJ['joystick_count'] = $(this).val()
    localStorage.setItem(R , JSON.stringify(OBJ))
    RState.buildMyRecipt(JSON.parse(localStorage.getItem(R)))
})

$('#Bdiscount').on('click' , function() {
    let discountValue = $('#discount').val()
    let R = $(this).attr('class')
    let OBJ = JSON.parse(localStorage.getItem(R))
    if(discountValue != ''){
            let d = new Date()
            OBJ['discount'] = OBJ['discount'] + parseFloat(discountValue)
            OBJ['totalnum'] = OBJ['totalnum'] - OBJ['discount']
            OBJ['history'].push('تم خصم مبلغ   '+  discountValue + ' في ' +d.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm# #AMPM#"))
            localStorage.setItem(R , JSON.stringify(OBJ))
            RState.buildMyRecipt(JSON.parse(localStorage.getItem(R)))
    }
    $('#discount').val('')
    $('#discountpercentage').val('')
        Why(R)
})
$('#ColorChangeForm').on("submit" , function(e) {
    let avacolor = $("#avacolor").val()
    let lockcolor = $("#lockcolor").val()
    let busycolor = $("#busycolor").val()
    let  color = {
        'avacolor' : avacolor,
        'lockcolor' : lockcolor,
        'busycolor' : busycolor
    }
    $.ajax({
        type: 'POST',
        url: '/changecolor',
        data: JSON.stringify(color),
        contentType: 'application/json;charset=UTF-8',
        beforeSend : function(){
        $('#colorChange').text('جاري ...')
        },
        complete: function(){
        $('#colorChange').text('حفظ')
        },
        success : function(data){
            alert(data)
        },
        error : function(errmsg) {
            alert(errmsg)
        }
        });
    e.preventDefault()
})
$('#WhyForm').on('submit' , function(e){
    let R = $(this).find('button').attr('id')
    let obj = JSON.parse(localStorage.getItem(R))
    obj['discountR'] = $('#reasonField').val()
    localStorage.setItem(R , JSON.stringify(obj))
    $('#reason').attr('style' , 'display : none !important')
    e.preventDefault()
})


$('#endOfRecipt').on('click' , function(){
    let objID = $(this).attr('class').split(' ')[2]
    let obj = JSON.parse(localStorage.getItem('R'+objID))
    if(obj['customer'] == undefined){
        alert("الرجاء اضافة عميل علي الفاتورة")
    }else{
        RState.endRecipt(objID)
    }
})

$("#YES").on('click' , function(){
    printDiv()
    let id = $('#BackDrop').attr('class')
    RState.afterEndOfRecipt(parseInt(id))
})

$("#NO").on('click' , function(){
    let id = $('#BackDrop').attr('class')
    RState.afterEndOfRecipt(parseInt(id))
})


$('#alarm').on('click' ,function() {
    let tiemM = $('#time').val()
    if(tiemM != ''){
        let id = $(this).data('c')
        let obj = JSON.parse(localStorage.getItem('R'+id))
        let counter = $('#D'+id).find('.Counter')
        $(counter).text(tiemM * 60)
        obj['type'] = 'withTime'
        obj['remain'] = tiemM
        $('#disalarm').attr('style' , 'display:inline !important')
        $('#alarm').attr('style' , 'display:none !important')
        PushAlarm(id , counter , obj)
    }else{
        alert('ادخل الوقت')
    }


})



$('#disalarm').on('click' , function(){
    let id = $(this).data('c')
    let getColor = $('#busycolor').val()
    $('#D'+id).attr('style' , `background-color:${getColor};`)
    let counter = $('#D'+id).find('.Counter')
    let obj = JSON.parse(localStorage.getItem('R'+id))
    obj['type'] = 'NoTime'
    $('#alarm').attr('style' , 'display:inline !important')
    $('#disalarm').attr('style' , 'display:none !important')
    clearInterval(obj['TIMMER'])
    $(counter).text(0)
    localStorage.setItem('R'+id , JSON.stringify(obj))
})

function PushAlarm(id , counter , obj) {
    let IDinterVal = setInterval(StartTimer , 1000 , id , counter );
    obj['TIMMER'] = IDinterVal
    localStorage.setItem('R'+id , JSON.stringify(obj))
}

function StartTimer(id , counter) {
var text = parseInt($(counter).text())
var New = text - 1
let obj = JSON.parse(localStorage.getItem('R'+id))
obj['remain'] = text
localStorage.setItem('R'+id , JSON.stringify(obj))
$(counter).text(New)
if(text <= 0){
let idDevice = $('#D'+id)
let getColor = $('#busycolor').val()
$(idDevice).attr('style' , `background-color:${getColor}; animation: t 0.2s ease-in-out  infinite;`)
$('#disalarm').prop('disabled' , false)
RState.setCalc(false)
let noti = document.getElementById("noti")
noti.play()
clearInterval(obj['TIMMER'])
$(counter).text(0)
}
}

$("#customeriNPUT").on('change' , function(){
    let R = $(this).attr('class')
    let OBJ = JSON.parse(localStorage.getItem(R))
    let rules = JSON.parse(localStorage.getItem('rules'))
    let discount = 0
    let rn = $("#cuustomers option[value='" + $('#customeriNPUT').val() + "']").data('rn')
    let payed = $("#cuustomers option[value='" + $('#customeriNPUT').val() + "']").data('payed')
    let special = $("#cuustomers option[value='" + $('#customeriNPUT').val() + "']").data('special')
    OBJ['customer'] = {
        'name' : $('#customeriNPUT').val(),
        'rn' : rn,
        'payed' : payed
    }
    rules.forEach(e => {
        if(rn > parseInt(e.count)){
            discount = parseFloat(e.value)
        }
    })
    if(special == "None"){
        if(discount > 0){
            let agree = confirm("هناك قاعدة خصم تطبق علي هذا العميل هل تريد تطبيقها ؟ ")
            if(agree){
                let d = new Date()
                OBJ['specialDis'] = discount
                OBJ['history'].push('تم تفعيل خصم مميز للعميل وقيمته   '+  parseInt(discount*100) + '%  في ' +d.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm# #AMPM#"))
            }
        }else{
            if(OBJ['specialDis'] != undefined){
                delete OBJ['specialDis']
            }
        }
    }else{
        let d = new Date()
        OBJ['specialDis'] = parseFloat(special)
        OBJ['history'].push('تم تفعيل خصم مميز للعميل وقيمته   '+  parseInt(special*100) + '%  في ' +d.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm# #AMPM#"))
    }

    localStorage.setItem(R , JSON.stringify(OBJ))
    RState.buildMyRecipt(JSON.parse(localStorage.getItem(R)))
})

$("#cusstomerNew").on("submit" , function(e){
    e.preventDefault()
    let name = $("#cusstomerNew #name").val()
    let phone = $("#cusstomerNew #phone").val()
    if(name == '' || phone == ''){
        alert("من فضلك اكمل البيانات")
    }else if (phone.length < 11 || phone.length > 11 || isNaN(phone)){
        alert("رقم الهاتف ﻻبد ان يكون 11 رقم او انك ادخلت رقم خاطئ")
    }
    else{
        $.ajax({
            type: 'POST',
            url: '/AddCustomer',
            data: JSON.stringify({"name" : name.trim() , "phone" : phone}),
            contentType: 'application/json;charset=UTF-8',
            beforeSend : function(){
            $('#garysend').text('جاري ...')
            $('#cusstomerNew').attr('style' , 'display:none !important')
            window.location.reload()
            },
            success : function(data){
                alert(data)
            },
            error : function(errmsg) {
                alert(errmsg.statusText)
            }
            });
    }

})

$("#AddCustomer").on("click" , function(){
    $('#cusstomerNew').attr('style' , 'display:block !important')
})

$("#close").on("click" , function(){
    $('#cusstomerNew').attr('style' , 'display:none !important')
})

function Why(r) {
    $('#reason').attr('style' , 'display:block !important')
    $('#reason').find('button').attr('id' , r)
}

function printDiv() {
    var divContents = document.getElementById("fatora_child").innerHTML;
    var a = window.open('', '', 'height=500, width=800');
    a.document.write('<html>');
    a.document.write('<head>');
    a.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">');
    a.document.write('<style>');
    a.document.write(`
    body {
        font-family: "Tajawal", sans-serif;
        -webkit-print-color-adjust: exact !important;
      }
      
        .Dte {
          font-size: 12px;
          text-align: center;
        }
        .img {
          margin: 3px auto;
          width: fit-content;
        }
        .img img {
          width: 100px;
        }
        table , th , td {
          border: .5px solid rgb(170, 170, 170);
          font-size: 11px !important;
        }
        table{
          width: 99%;
          border-collapse: collapse;
          color: rgb(0, 0, 0);
          margin: 0px auto;
          text-align: center;
          background-color: white;
        }
        @media print{.notes{page-break-after: always}}
        .infoss{
            display: grid;
            grid-template-columns: repeat(2, 40%);
            justify-content: center;
            text-align: center;
            gap: 10px;
            margin-top:5px;
            direction:rtl;
        }
        .infoss span{
            border: black .5px solid;
        }
    `);
    a.document.write('</style>');
    a.document.write('</head>');
    a.document.write(divContents);
    a.document.write("<script> setTimeout(function(){window.print();window.close();}, 500); </script>");
    a.document.write('</html>');
   // a.print();
}

