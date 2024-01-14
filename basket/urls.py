from django.urls import path

from basket.api import OrderListView, OrderCreateView

urlpatterns = [
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('orders/', OrderCreateView.as_view(), name='order-create'),
    # Add other URL patterns as needed
]
