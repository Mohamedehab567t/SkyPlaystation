$('#iconsforservices .img').on('click' , function() {
    $(this).toggleClass('s-active').siblings().removeClass('s-active')
})

var Service = new ServiceComponent('add' , null)
$('#serviceform').on('submit' , function(e) {
    Service.AddService($(this))
    e.preventDefault()
})

var Product = new ProductComponent('add' , null)
$('#productform').on('submit' , function(e) {
    Product.AddProduct($(this))
    e.preventDefault()
})

var Message = new MessageComponent('add' , null)
$('#Mmsg').on('submit' , function(e) {
    Message.AddMessages($(this))
    e.preventDefault()
})


var Buy = new BuyComponent('add' , null)
$('#Bbuy').on('submit' , function(e) {
    Buy.AddBuy($(this))
    e.preventDefault()
})















