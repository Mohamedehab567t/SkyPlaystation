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


var Productt = new ProductComponent('modify' , null)
$('#productform').on('submit' , function(e) {
    e.preventDefault()
    Productt.AddProduct($(this))
})

var Product = new ProductComponent('storage' , null)
$('#productformstorage').on('submit' , function(e) {
    e.preventDefault()
    Product.AddProduct($(this))
})

