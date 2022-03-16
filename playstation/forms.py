from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Length
from .functions import Validate_account , Validate_password


class Login(FlaskForm):
    n = StringField('رقم المستخدم' , validators=[DataRequired(message="ادخل رقمك الصحيح"),Validate_account])
    password = PasswordField("كلمة المرور" , validators=[DataRequired(message='ادخل كلمة المرور') , Length(min=1 , max=20), Validate_password])
    submit = SubmitField('تسجيل الدخول')