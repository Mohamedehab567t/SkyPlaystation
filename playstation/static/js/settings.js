$('#iconsforservices .img').on('click' , function() {
    $(this).toggleClass('s-active').siblings().removeClass('s-active')
})

var Service = new ServiceComponent('add' , null)
$('#serviceform').on('submit' , function(e) {
    Service.AddService($(this))
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
var User = new UserComponent('add' , null)
$("#userAddForm").on('submit' , function(e) {
    User.AddUser($(this))
    e.preventDefault()
})

$(".modifyUser").on('click' , function(){
    var User = new UserComponent('modify' , null)
    User.AddUser($(this))
})
$(".showPass").on('click' , function(){
    let input = $("#"+$(this).data("input"))
    $(input).attr("type") == "password" ? $(input).attr("type" , "text") : $(input).attr("type" , "password")

})

$(".OperateOnDevice").on('click' , function(){
    $.ajax({
        type: 'POST',
        url: '/getinfo',
        data: JSON.stringify({"id" : $(this).attr("id")}),
        contentType: 'application/json;charset=UTF-8',
        success : function(data){
            var newWin = open('تعديل','_blank',"width=800","toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500");
            let html = document.createElement('html')
            $(html).html(data)
            newWin.resizeTo(500, 300);
            newWin.document.write(html.innerHTML);
        },
        error : function(errmsg) {
            alert(errmsg.statusText)
        }
        });
})






$("#Mrule").on('submit' , function(e){
    e.preventDefault()
    $.ajax({
        type: 'POST',
        url: '/addrule',
        data: JSON.stringify({"count" : $(this).find("#Rnumber").val() , "value" : $(this).find("#Rvalue").val()}),
        contentType: 'application/json;charset=UTF-8',
        success : function(data){
            alert(data)
            window.location.reload
        },
        error : function(errmsg) {
            alert(errmsg.statusText)
        }
        });
})








