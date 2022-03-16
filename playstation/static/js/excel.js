$('#SearchNow').on('click' , function(){
    let arrayofSearch = [
         $('#SN'),
         $('#RN'),
         $('#SSN'),
         $("#customer"),
         $("#from"),
         $("#to")
    ]
    let val = {}
    arrayofSearch.forEach(e => {
        console.log($(e).val())
        if($(e).val() != ''){
            if($(e).attr('id') != 'SSN' && $(e).attr('id') != 'customer' && $(e).attr('id') != 'from' && $(e).attr('id') != 'to'){
                val[$(e).data('key')] = parseInt($(e).val())
            }else{
                val[$(e).data('key')] = $(e).val()
            }

        }
    })
    console.log(val)
        $.ajax({
            type: 'POST',
            url: '/Excel',
            data: JSON.stringify(val),
            contentType: 'application/json;charset=UTF-8',
            beforeSend : function(){
                $('#SearchNow').text('جاري ... ')
            },
            complete: function(){
                $('#SearchNow').text('بحث')
            },
            success : function(data){
                $('#tableConR').html(data)
            },
            error : function(errmsg) {
                alert(errmsg)
            }
            });
})

$('#SearchNow2').on('click' , function() {
    let arrayofSearch = [
        $('#t'),
        $('#v'),
        $('#snn'),
        $("#from2"),
        $("#to2")
   ]
   let val = {}
   arrayofSearch.forEach(e => {
       if($(e).val() != ''){
           if($(e).attr('id') != 't' && $(e).attr('id') != 'from2' && $(e).attr('id') != 'to2'){
               val[$(e).data('key')] = parseInt($(e).val())
           }else{
               val[$(e).data('key')] = $(e).val()
           }

       }
   })
   $.ajax({
       type: 'POST',
       url: '/Excel2',
       data: JSON.stringify(val),
       contentType: 'application/json;charset=UTF-8',
       beforeSend : function(){
           $('#SearchNow2').text('جاري ... ')
       },
       complete: function(){
           $('#SearchNow2').text('بحث')
       },
       success : function(data){
           $('#tableConR2').html(data)
       },
       error : function(errmsg) {
           alert(errmsg)
       }
       });
})


$('#searchCustomer').on('keyup' , function(){
    var Names = Array.from($('#CustomerTable').find('.cName'))
    Names.forEach(e => {
        var IndexOF = e.textContent.trim().indexOf($("#searchCustomer").val())
            if(IndexOF > -1 ){
            var tr = $(e).closest('tr')
            $(tr).attr('style' , 'display:table-row !important')
            }else if (IndexOF == -1 ){
            var tr = $(e).closest('tr')
            $(tr).attr('style' , 'display:none !important')
            }
        })
})

$("#Calculate").on("click" , function(){
    $("#CalculateDiv").attr('style' , 'display:block !important')
})

$("#closeCalculate").on("click" , function(){
    $('#Calculated').empty()
    $("#CalculateDiv").attr('style' , 'display:none !important')
})

$("#CalculateForm").on("submit" , function(e){
    e.preventDefault()
    let fShift = $(this).find("#lastsiftid")[0].value
    let sShift = $(this).find("#backtoshift")[0].value
    if (sShift != ''){
        $.ajax({
            type: 'POST',
            url: '/CalculateShifts',
            data: JSON.stringify({"from" : fShift , "to" : sShift}),
            contentType: 'application/json;charset=UTF-8',
            beforeSend : function(){
                $('#sendCalculate').text('جاري ... ')
            },
            complete: function(){
                $('#sendCalculate').text('حساب')
            },
            success : function(data){
                if(typeof data == "string"){
                    alert(data)
                }else {
                    Object.keys(data).forEach(e => {
                        let p = document.createElement('p')
                        if(isNaN(parseInt(e))){
                            $(p).text(`مجمع : ${parseInt(data[e])}`)
                        }else{
                            $(p).text(`رقم الشيفت : ${e} = اجمالي : ${parseInt(data[e])}`)
                        }

                        $('#Calculated').append(p)
                    })
                }
            },
            error : function(errmsg) {
                alert(errmsg)
            }
            });
    }else{
        alert("اكمل البيانات لارجاع حسابات صحيحة")
    }

})