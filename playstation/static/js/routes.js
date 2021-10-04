$(document.getElementById('S')).hide()
$(document.getElementById('excel')).hide()
$(document.getElementById('services')).hide()

if(location.hash === ""){
    if(screen.width < 770){
        location.hash = "excel"
    }else{
        location.hash = "services"
    }
}

var urlController = new url(['services' , 'S' , 'excel'])
let OpenedUrl = location.hash.substr(location.hash.indexOf('#') + 1);
urlController.GetHashView(OpenedUrl)
urlController.activeTheAnchor(OpenedUrl)

$('#GetMenue').on('click',function(){
    $('.menue').toggleClass('hideshow')
})

$( window ).on( 'hashchange', function( e ) {
    let onChangeUrl = location.hash.substr(location.hash.indexOf('#') + 1);
    urlController.GetHashView(onChangeUrl)
    urlController.activeTheAnchor(onChangeUrl)
    if(onChangeUrl == 'services'){
        if(screen.width < 770){
            alert('ليس لك صالحية دخول')
            location.hash = 'excel'
        }else{
            urlController.refreshDiv('TableCon' , 'S-Table')
            urlController.refreshDiv('HH' , 'Hh')
            urlController.refreshDiv('PP' , 'Pp')
            urlController.refreshDiv('BUY' , 'Buy')
            urlController.refreshDiv('TOTAL' , 'Total')
        }
    }else if (onChangeUrl == 'excel' ||onChangeUrl == 'excelBuy' ){
        urlController.refreshDiv('tableConR2' , 'twoTabels2')
    }
});

