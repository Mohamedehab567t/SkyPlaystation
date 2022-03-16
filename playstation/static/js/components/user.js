class UserComponent {

    constructor(status = "" , elements = []){
        this.status = status
        this.elements = elements
    }


    AddUser(form){
        if(this.status == 'add'){
            let fID = $(form).attr('id')
            let name = $('#'+fID+' #nameuser').val()
            let password = $('#'+fID+' #passworduser').val()
            let statee = $('#'+fID+' #userstate').val()
            if(name == '' || password == ''){
                alert('اكمل بيانات المستخدم')
            }else{
                let msg = {
                    'name' : name.trim(),
                    'password' : password,
                    'state' : statee
                }
                $.ajax({
                    type: 'POST',
                    url: '/AddUser',
                    data: JSON.stringify(msg),
                    contentType: 'application/json;charset=UTF-8',
                    beforeSend : function(){
                    $('#useradd').text('جاري ...')
                    },
                    complete: function(){
                    $('#useradd').text('اضف')
                    },
                    success : function(data){
                        alert(data)
                    },
                    error : function(errmsg) {
                        alert(errmsg)
                    }
                    });
            }
        }else if (this.status == 'modify'){
            let id = $(form).data('id')
            let name = $('#N'+id).val()
            let password = $('#P'+id).val()
            let statee = $('#S'+id).val()
            if(name == '' || password == ''){
                alert('ﻻ يمكن التعديل بقيم فارغة')
            }else{
                let msg = {
                    'name' : name.trim(),
                    'id' : id,
                    'password' : password,
                    'state' : statee
                }
                $.ajax({
                    type: 'POST',
                    url: '/ModifyUser',
                    data: JSON.stringify(msg),
                    contentType: 'application/json;charset=UTF-8',
                    beforeSend : function(){
                    $(form).text('جاري ...')
                    },
                    complete: function(){
                    $(form).text('اضف')
                    },
                    success : function(data){
                        alert(data)
                        window.location.reload()
                    },
                    error : function(errmsg) {
                        alert(errmsg)
                    }
                    });
            }
        }
        else{
            throw 'The status is invalid'
        }
    }


}
