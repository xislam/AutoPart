from django.contrib.auth.forms import UserCreationForm

from accounts.models import User


class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('phone_number', 'full_name', 'password1', 'password2', 'email', 'role')
