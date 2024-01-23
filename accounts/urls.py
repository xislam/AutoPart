from django.urls import path

from accounts.api import RegistrationAPIView, UserLoginAPIView, CustomPasswordResetView, UserUpdateView, \
    FavoriteProductListCreateView, FavoriteProductListView, FavoriteProductDeleteView
from accounts.views import SignupHTMLView, SigninHTMLView, ProfileHTMLView

urlpatterns = [
    path('api/register/', RegistrationAPIView.as_view(), name='user-registration'),
    path('login/', UserLoginAPIView.as_view(), name='user_login'),
    path('password-reset/', CustomPasswordResetView.as_view(), name='password-reset'),
    path('profile/', UserUpdateView.as_view(), name='user-update'),
    path('favorite_products/', FavoriteProductListCreateView.as_view(), name='favorite-product-create'),
    path('favorite_products_list/', FavoriteProductListView.as_view(), name='favorite-product-list'),
    path('favorite_delete/<int:pk>/', FavoriteProductDeleteView.as_view(), name='favorite-product-delete'),

    # Add other URL patterns as needed

    path('signup_html/', SignupHTMLView.as_view(), name='signup_html'),
    path('signin_html/', SigninHTMLView.as_view(), name='signin_html'),
    path('profile_html/', ProfileHTMLView.as_view(), name='profile_html'),

]
