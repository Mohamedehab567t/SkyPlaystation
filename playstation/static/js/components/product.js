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
            let mesurment = $('#'+fID+' #mesurment').val()
            let sa7ba = $('#'+fID+' #sa7ba').val()
            let boxquantity = $('#'+fID+' #addstorage').val()
            let quantityinbox = $('#'+fID+' #quantityinbox').val()
            console.log(quantityinbox)
            if(name == '' || price == '' || mesurment == '' || sa7ba == '' || boxquantity == '' ||quantityinbox == ''){
                alert('اكمل بيانات الخدمة')
            }else if(parseFloat(price) <= 0){
                alert("سعر المنتج غير مقبول")
            }
            else{
                let product = {
                    'P-name' : name.trim(),
                    'P-price' : price.trim(),
                    'mesurment':mesurment,
                    'sa7ba' : sa7ba,
                    'boxquantity' : boxquantity,
                    'quantityinbox' : quantityinbox,
                    'totalquantity' : (parseInt(boxquantity) * parseInt(quantityinbox))
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
        }else if(this.status == 'modify'){
            let fID = $(form).attr('id')
            let name = $('#'+fID+' #nameofproduct').val()
            let price = $('#'+fID+' #priceofproduct').val()
            if(name == '' || price == ''){
                alert('اكمل بيانات الخدمة')
            }else{
                let product = {
                    'id' : $(form).data('id'),
                    'name' : name.trim(),
                    'price' : price.trim(),
                }
                $.ajax({
                    type: 'POST',
                    url: '/ModifyProductData',
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
                        window.location.reload()
                    },
                    error : function(errmsg) {
                        alert(errmsg)
                    }
                    });
            }
        }else if(this.status == 'storage'){
            let fID = $(form).attr('id')
            let addstorage = $('#'+fID+' #addstorage').val()
            let sa7ba = $('#'+fID+' #sa7ba').val()
            let quantityinbox = $('#'+fID+' #quantityinbox').val()
            if(addstorage == '' || sa7ba == '' || quantityinbox == ''){
                alert('اكمل بيانات المنتج')
            }else{
                let product = {
                    'id' : $(form).data('id'),
                    'addstorage' : addstorage.trim(),
                    'sa7ba' : sa7ba.trim(),
                    'quantityinbox' : quantityinbox.trim()
                }
                $.ajax({
                    type: 'POST',
                    url: '/modifyProductStorageData',
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