class BuyComponent {

    constructor(status = "" , elements = []){
        this.status = status
        this.elements = elements
    }


    AddBuy(form){
        if(this.status == 'add'){
            let fID = $(form).attr('id')
            let title = $('#'+fID+' #BT').val()
            let value = $('#'+fID+' #BV').val()
            if(title == '' || value == ''){
                alert('اكمل بيانات المصروف')
            }else{
                let date = new Date()
                let msg = {
                    't' : title.trim(),
                    'v' : parseInt(value),
                    'd' : date.customFormat("#YYYY#/#MM#/#DD#"),
                    's' : date.toISOString()
                }
                $.ajax({
                    type: 'POST',
                    url: '/AddBuy',
                    data: JSON.stringify(msg),
                    contentType: 'application/json;charset=UTF-8',
                    beforeSend : function(){
                    $('#BB-add').text('جاري ...')
                    },
                    complete: function(){
                    $('#BB-add').text('اضف')
                    },
                    success : function(data){
                        alert(data)
                    },
                    error : function(errmsg) {
                        alert(errmsg)
                    }
                    });
            }
        }else{
            throw 'The status is invalid'
        }
    }


}