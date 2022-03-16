var Product = new ProductComponent('add' , null)
$('#productform').on('submit' , function(e) {
    Product.AddProduct($(this))
    e.preventDefault()
})