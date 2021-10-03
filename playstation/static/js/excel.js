$('#SearchNow').on('click' , function(){
    let arrayofSearch = [
         $('#SN'),
         $('#RN'),
         $('#SSN')
    ]
    let val = {}
    arrayofSearch.forEach(e => {
        if($(e).val() != ''){
            if($(e).attr('id') != 'SSN'){
                val[$(e).data('key')] = parseInt($(e).val())
            }else{
                val[$(e).data('key')] = $(e).val()
            }

        }
    })
    let DateSearch = Array.from($('.DateSearch'))
    let serachDate =[]
    DateSearch.forEach(e => {
        if($(e).val() != ''){
            serachDate.push($(e).val())
        }
    })
    if(serachDate.length !=0){
        val['serachDate'] = serachDate
    }

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
        $('#snn')
   ]
   let val = {}
   arrayofSearch.forEach(e => {
       if($(e).val() != ''){
           if($(e).attr('id') != 't'){
               val[$(e).data('key')] = parseInt($(e).val())
           }else{
               val[$(e).data('key')] = $(e).val()
           }

       }
   })
   let DateSearch = Array.from($('.DateSearch'))
   let serachDate =[]
   DateSearch.forEach(e => {
       if($(e).val() != ''){
           serachDate.push($(e).val())
       }
   })
   if(serachDate.length !=0){
       val['serachDate'] = serachDate
   }
   console.log(val)
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