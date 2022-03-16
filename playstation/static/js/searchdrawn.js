$('#SearchNow2').on('click' , function() {
    let arrayofSearch = [
        $('#shiftnumber'),
        $('#r_n'),
        $('#name'),
        $("#from2"),
        $("#to2")
   ]
   let val = {}
   arrayofSearch.forEach(e => {
       if($(e).val() != ''){
           if($(e).attr('id') != 'name' && $(e).attr('id') != 'from2' && $(e).attr('id') != 'to2'){
               val[$(e).data('key')] = parseInt($(e).val())
           }else{
               val[$(e).data('key')] = $(e).val()
           }

       }
   })
   $.ajax({
       type: 'POST',
       url: '/Excel3',
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