from django.urls import path

from basket.api import OrderListView

urlpatterns = [
    path('orders/', OrderListView.as_view(), name='order-create'),
    # Add other URL patterns as needed
]
