class ServiceComponent {

    constructor(status = "" , elements = []){
        this.status = status
        this.elements = elements
    }


    AddService(form){
        if(this.status == 'add'){
            let fID = $(form).attr('id')
            let name = $('#'+fID+' #nameofservice').val()
            let price = $('#'+fID+' #priceofservice').val()
            let icon = $('#'+fID+' #iconsforservices .s-active').data('name')
            if(name == '' || price == '' || icon == undefined){
                alert('اكمل بيانات الخدمة')
            }else{
                let service = {
                    'S-name' : name.trim(),
                    'S-price' : price.trim(),
                    'S-icon' : icon,
                    'S-status' : 'available'
                }
                $.ajax({
                    type: 'POST',
                    url: '/AddService',
                    data: JSON.stringify(service),
                    contentType: 'application/json;charset=UTF-8',
                    beforeSend : function(){
                    $('#S-ADD').text('جاري ...')
                    },
                    complete: function(){
                    $('#S-ADD').text('اضف خدمة')
                    },
                    success : function(data){
                        alert(data['msg'])
                        localStorage.setItem('D'+data['id'] , 'available')
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