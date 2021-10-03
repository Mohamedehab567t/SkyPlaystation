var urlController = new url(null)
const RState = new rState(false)

RState.ChangeState($('.DeviceRecipt'))
let prevChoosed = 0;
$(window).on('click' , function(e) {
    if($(e.target).hasClass('ShadowDevice')){
        if(prevChoosed == 0){
            RState.showRelatedRecipt(prevChoosed , $(e.target).attr('id') , $('.DeviceRecipt'))
            prevChoosed = $(e.target).attr('id')
        }else{
            RState.showRelatedRecipt(prevChoosed , $(e.target).attr('id') , $('.DeviceRecipt'))
            prevChoosed = $(e.target).attr('id')
        }
    }else if ($(e.target).hasClass('plus')){
        RState.addProductToTheRecipt($(e.target))
    }else if ($(e.target).hasClass('min')){
        RState.deleteProductToTheRecipt($(e.target))
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
    }
})

$(document).ready(function() {
    let devices = Array.from($('.device'))
    devices.forEach(e => {
        localStorage.setItem($(e).attr('id'),$(e).data('status'))
    })
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
    urlController.refreshDiv , $(device).data('price'))
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

$('#Bdiscount').on('click' , function() {
    let discountValue = $('#discount').val()
    let R = $(this).attr('class')
    let OBJ = JSON.parse(localStorage.getItem(R))
    if(discountValue != ''){
        OBJ['discount'] = OBJ['discount'] + parseFloat(discountValue)
        OBJ['totalnum'] = OBJ['totalnum'] - OBJ['discount']
        let d = new Date()
        OBJ['history'].push('تم خصم مبلغ   '+  discountValue + ' في ' +d.customFormat("#DD#/#MM#/#YYYY# #hh#:#mm# #AMPM#"))
        localStorage.setItem(R , JSON.stringify(OBJ))
        RState.buildMyRecipt(JSON.parse(localStorage.getItem(R)))
    }
    $('#discount').val('')
    Why(R)
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
    RState.endRecipt(objID)
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
    $('#D'+id).attr('style' , 'background-color:#93FB96;')
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
$(idDevice).attr('style' , 'background-color:#FF163E; animation: t 0.2s ease-in-out  infinite;')
$('#disalarm').prop('disabled' , false)
RState.setCalc(false)
let noti = document.getElementById("noti")
noti.play()
clearInterval(obj['TIMMER'])
$(counter).text(0)
}
}


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
          height: 100px;
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
    a.document.close();
    a.print();
}

