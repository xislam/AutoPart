from django.urls import path

from basket.api import OrderListView, OrderCreateView, OrderListCreateView, OrderRetrieveUpdateDestroyView

urlpatterns = [
    path('orders_list/', OrderListView.as_view(), name='order-list'),
    path('orders/', OrderCreateView.as_view(), name='order-create'),
    path('orders_admin/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders_admin/<int:pk>/', OrderRetrieveUpdateDestroyView.as_view(), name='order-retrieve-update-destroy'),
    # Add other URL patterns as needed
]
