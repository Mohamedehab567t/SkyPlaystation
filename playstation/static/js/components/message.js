class MessageComponent {

    constructor(status = "" , elements = []){
        this.status = status
        this.elements = elements
    }


    AddMessages(form){
        if(this.status == 'add'){
            let fID = $(form).attr('id')
            let name = $('#'+fID+' #Mval').val()
            if(name == ''){
                alert('اكمل بيانات الرسالة')
            }else{
                let msg = {
                    'msg' : name.trim()
                }
                $.ajax({
                    type: 'POST',
                    url: '/AddMessage',
                    data: JSON.stringify(msg),
                    contentType: 'application/json;charset=UTF-8',
                    beforeSend : function(){
                    $('#M-add').text('جاري ...')
                    },
                    complete: function(){
                    $('#M-add').text('اضف رسالة')
                    },
                    success : function(data){
                        alert(data)
                    },
                    error : function(errmsg) {
                        alert(errmsg.statusText)
                    }
                    });
            }
        }else{
            throw 'The status is invalid'
        }
    }


}