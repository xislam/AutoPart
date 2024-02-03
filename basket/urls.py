from django.urls import path

from basket.api import OrderListView, OrderCreateView, OrderListCreateView, OrderRetrieveUpdateDestroyView
from basket.views import AdminOrderpageHTMLView, AdminPageOrderpageHTMLView

urlpatterns = [
    path('orders_list/', OrderListView.as_view(), name='order-list'),
    path('orders/', OrderCreateView.as_view(), name='order-create'),
    path('orders_admin/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders_admin/<int:pk>/', OrderRetrieveUpdateDestroyView.as_view(), name='order-retrieve-update-destroy'),
    # Add other URL patterns as needed
    path('admin_order/', AdminOrderpageHTMLView.as_view(), name='admin_orderpage'),
    path('admin_page/', AdminPageOrderpageHTMLView.as_view(), name='admin_page_orderpage'),
]
