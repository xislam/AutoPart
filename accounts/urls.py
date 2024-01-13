from django.urls import path

from accounts.api import RegistrationAPIView, UserLoginAPIView, CustomPasswordResetView

urlpatterns = [
    path('api/register/', RegistrationAPIView.as_view(), name='user-registration'),
    path('login/', UserLoginAPIView.as_view(), name='user_login'),
    path('password-reset/', CustomPasswordResetView.as_view(), name='password-reset'),
    # Add other URL patterns as needed
]
