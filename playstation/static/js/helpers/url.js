class url {
    constructor(urlList = []) {
      this.urlList = urlList;
    }
    GetHashView(hash){
        let view = document.getElementById(hash)
        let divSibling = Array.from($(view).siblings('div'))
        divSibling.forEach(e => {
            if($(e).attr('id')){
                $(e).hide()
            }
        })
        $(view).show();
    }
    activeTheAnchor(hash){
        let anchor = $('#A'+hash)
        $(anchor).addClass('m-active').siblings().removeClass('m-active')
    }
    refreshDiv(parentID = "",childID = ""){
        $( "#"+parentID ).load(window.location.href + " #"+childID );
    }
  }