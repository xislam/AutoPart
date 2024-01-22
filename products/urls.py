from django.urls import path

from products.api import ProductListView, CarMakeListView, CarNameListView, PopularProductListView, CategoryListView, \
    ProductDetailView, ProductSearchView, CategoryListView2
from products.views import ProductsHTMLView

urlpatterns = [
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products_s/', ProductSearchView.as_view(), name='product-list'),
    path('products_category/', CategoryListView2.as_view(), name='product-list'),
    path('carmakes/', CarMakeListView.as_view(), name='carmake-list'),
    path('carnames/', CarNameListView.as_view(), name='carname-list'),
    path('popular_products/', PopularProductListView.as_view(), name='popular-product-list'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('products/<int:id>/', ProductDetailView.as_view(), name='product-detail'),

    path('products_html/', ProductsHTMLView.as_view(), name='products'),

]
