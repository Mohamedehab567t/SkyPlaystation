from flask import url_for

class Front():
    def __init__(self) :
        pass
    
    def Getcss(*filename):
        bootstrap = url_for('static' , filename='css/css/bootstrap.css')
        font = url_for('static' , filename = 'css/css/font-awesome.min.css')
        normalization = url_for('static' , filename = 'css/css/normalize.css')
        css = [bootstrap , font , normalization]
        for f in filename :
            file = url_for('static' , filename = 'css/css/')+f+'.css'
            css.append(file)
        return css
    def Getjs(*filename):
        popper = url_for('static' , filename = 'js/popper.js')
        jQuery = url_for('static' , filename = 'js/jquery-3.5.1.js')
        bootstrap = url_for('static' , filename='js/bootstrap.js')
        js = [popper , jQuery , bootstrap]
        for f in filename :
            file = url_for('static' , filename = 'js/')+f
            js.append(file)
        return js