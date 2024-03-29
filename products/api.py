from django.db.models import Count, Subquery, OuterRef
from django.db.models.functions import Concat
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from rest_framework.generics import RetrieveAPIView, get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django.db.models import Count, Value, CharField

from accounts.models import FavoriteProduct
from basket.models import Order
from .models import Product, CarMake, CarName, Category
from .serializers import ProductSerializer, CarMakeSerializer, CarNameSerializer, CategorySerializer, \
    CategoryWithProductCountSerializer

import django_filters


class CustomPageNumberPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 10000

    def get_page_size(self, request):
        """
        Determine the page size by the page_size_query_param in the request.
        """
        page_size = super().get_page_size(request)
        if self.page_size_query_param:
            param_page_size = int(request.query_params.get(self.page_size_query_param, 0))
            if param_page_size > 0:
                return param_page_size
        return page_size


class ProductFilter(django_filters.FilterSet):
    model_year__gte = django_filters.NumberFilter(field_name='model_year', lookup_expr='gte')
    model_year__lte = django_filters.NumberFilter(field_name='model_year', lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category__name', lookup_expr='icontains')
    name_product = django_filters.CharFilter(method='filter_name_product')

    class Meta:
        model = Product
        fields = {
            'car_info__car_name': ['icontains'],
        }

    def filter_name_product(self, queryset, name_product, value):
        names = value.split(',')  # Split the input into a list of names
        filters = [django_filters.filters.Q(name_product__exact=name.strip()) for name in names]
        combined_filters = filters.pop()
        for f in filters:
            combined_filters |= f
        return queryset.filter(combined_filters)


class ProductsFilter(django_filters.FilterSet):
    class Meta:
        model = Product
        fields = {
            'car_info__car_name': ['icontains'],
            'name_product': ['icontains']
        }


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.exclude(
        id__in=Subquery(Order.objects.filter(product=OuterRef('id')).values('product'))
    )
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter
    pagination_class = CustomPageNumberPagination


class CarMakeListView(generics.ListAPIView):
    queryset = CarMake.objects.all()
    serializer_class = CarMakeSerializer


class CarNameListView(generics.ListAPIView):
    queryset = CarName.objects.all()
    serializer_class = CarNameSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['car_make__make']


class PopularProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_popular=True)
    serializer_class = ProductSerializer
    pagination_class = CustomPageNumberPagination


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # Получите текущего пользователя
        user = self.request.user

        # Проверьте, что пользователь аутентифицирован
        if user is not None and user.is_authenticated:
            # Получите информацию о том, добавлен ли продукт в избранное для данного пользователя
            is_favorite = FavoriteProduct.objects.filter(user=user, product=instance).exists()
        else:
            is_favorite = False

        # Добавьте информацию об избранном продукте в данные ответа
        data = {
            'product': serializer.data,
            'is_favorite': is_favorite
        }

        return Response(data)


class ProductSearchView(generics.ListAPIView):
    queryset = Product.objects.exclude(
        id__in=Subquery(Order.objects.filter(product=OuterRef('id')).values('product'))
    )
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductsFilter
    search_fields = ['name_product']
    pagination_class = CustomPageNumberPagination


class CategoryListView2(generics.ListAPIView):
    serializer_class = CategoryWithProductCountSerializer

    def get_queryset(self):
        car_name = self.request.query_params.get('car_name', None)

        queryset = Category.objects.annotate(product_count=Count('product'))

        if car_name:
            # If car name is provided, filter categories for that car
            queryset = queryset.filter(product__car_info__car_name=car_name)

        return queryset.distinct()
