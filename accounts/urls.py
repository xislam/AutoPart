from django.urls import path

from accounts.api import RegistrationAPIView, UserLoginAPIView, CustomPasswordResetView, UserUpdateView, \
    FavoriteProductListCreateView, FavoriteProductListView, FavoriteProductDeleteView

urlpatterns = [
    path('api/register/', RegistrationAPIView.as_view(), name='user-registration'),
    path('login/', UserLoginAPIView.as_view(), name='user_login'),
    path('password-reset/', CustomPasswordResetView.as_view(), name='password-reset'),
    path('profile/', UserUpdateView.as_view(), name='user-update'),
    path('favorite_products/', FavoriteProductListCreateView.as_view(), name='favorite-product-create'),
    path('favorite_products_list/', FavoriteProductListView.as_view(), name='favorite-product-list'),
    path('favorite_delete/<int:pk>/', FavoriteProductDeleteView.as_view(), name='favorite-product-delete'),

    # Add other URL patterns as needed
]
