from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextAreaField, BooleanField
from wtforms.validators import InputRequired, DataRequired, Optional, URL, AnyOf, NumberRange, ValidationError
from flask_wtf.file import FileField

def check_photo_inputs(form, field):
        if field.data and form.photo_upload.data:
            raise ValidationError('Only one photo submission allowed')

class CupcakeForm(FlaskForm):
    """Form for adding cupcakes."""

    flavor = StringField("Flavor", validators=[InputRequired()])
    size = StringField("Size", 
                          validators=[InputRequired(), 
                                      AnyOf(message="Sorry, you can only choose from small, medium, or large",
                                            values=["small", "medium", "large"])])
    photo_url = StringField("Photo URL", validators=[Optional(), URL(), check_photo_inputs])
    photo_upload = FileField("Photo Upload", validators=[Optional()])
    rating = IntegerField("Rating", 
                       validators=[Optional(), 
                                   NumberRange(min=1, max=10, 
                                               message="Sorry, the rating must be from 1 to 10")])

# class EditPetForm(FlaskForm):
#     """Form for editing pets."""

#     photo_url = StringField("Photo URL", validators=[Optional(), URL(), check_photo_inputs])
#     photo_upload = FileField("Photo Upload", validators=[Optional()])
#     notes = TextAreaField("Notes", validators=[Optional()])
#     available = BooleanField("Available", validators=[Optional()])