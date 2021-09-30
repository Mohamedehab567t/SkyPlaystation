class ProductComponent {

    constructor(status = "" , elements = []){
        this.status = status
        this.elements = elements
    }


    AddProduct(form){
        if(this.status == 'add'){
            let fID = $(form).attr('id')
            let name = $('#'+fID+' #nameofproduct').val()
            let price = $('#'+fID+' #priceofproduct').val()
            if(name == '' || price == ''){
                alert('اكمل بيانات الخدمة')
            }else{
                let product = {
                    'P-name' : name.trim(),
                    'P-price' : price.trim()
                }
                $.ajax({
                    type: 'POST',
                    url: '/AddProduct',
                    data: JSON.stringify(product),
                    contentType: 'application/json;charset=UTF-8',
                    beforeSend : function(){
                    $('#P-add').text('جاري ...')
                    },
                    complete: function(){
                    $('#P-add').text('اضف منتج')
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