from django.urls import path

from products.api import ProductListView, CarMakeListView, CarNameListView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('carmakes/', CarMakeListView.as_view(), name='carmake-list'),
    path('carnames/', CarNameListView.as_view(), name='carname-list'),
]
