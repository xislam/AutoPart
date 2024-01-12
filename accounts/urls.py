from django.urls import path

from accounts.api import RegistrationAPIView, UserLoginAPIView

urlpatterns = [
    path('api/register/', RegistrationAPIView.as_view(), name='user-registration'),
    path('login/', UserLoginAPIView.as_view(), name='user_login'),
    # Add other URL patterns as needed
]
