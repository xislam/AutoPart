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
    page_size = 14
    page_size_query_param = 'page_size'
    max_page_size = 10000


class ProductFilter(django_filters.FilterSet):
    model_year__gte = django_filters.NumberFilter(field_name='model_year', lookup_expr='gte')
    model_year__lte = django_filters.NumberFilter(field_name='model_year', lookup_expr='lte')
    category = django_filters.CharFilter(field_name='category__name', lookup_expr='icontains')

    class Meta:
        model = Product
        fields = {
            'car_info__car_name': ['icontains'],

        }

    def filter_name_product(self, queryset, name_product, value):
        names = value.split(',')  # Split the input into a list of names
        filters = [django_filters.filters.Q(name_product__icontains=name) for name in names]
        combined_filters = filters.pop()
        for f in filters:
            combined_filters |= f
        return queryset.filter(combined_filters)


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.exclude(
        id__in=Subquery(Order.objects.filter(product=OuterRef('id')).values('product'))
    )
    pagination_class = CustomPageNumberPagination
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Получение итоговой информации по количеству продуктов с именами
        model_counts = queryset.values('car_info__car_name').annotate(
            count=Count('id'),
            detail_names=Concat('name_product', Value(', '), output_field=CharField())
        )

        result_data = {'products': [], 'categories': []}

        for item in model_counts:
            car_name = item['car_info__car_name']
            count = item['count']
            detail_names = item['detail_names']

            # Добавление информации о категории в список 'categories'
            result_data['categories'].append({'car_name': car_name, 'count': count, 'detail_names': detail_names})

        # Сериализация продуктов и добавление в список 'products'
        result_data['products'] = self.get_serializer(queryset, many=True).data

        return Response(result_data, status=status.HTTP_200_OK)


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
    pagination_class = CustomPageNumberPagination
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter
    search_fields = ['name_product']

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        # Получение итоговой информации по количеству продуктов с именами
        model_counts = queryset.values('car_info__car_name').annotate(
            count=Count('id'),
            detail_names=Concat('name_product', Value(', '), output_field=CharField())
        )

        result_data = {'products': [], 'categories': []}

        for item in model_counts:
            car_name = item['car_info__car_name']
            count = item['count']
            detail_names = item['detail_names']

            # Добавление информации о категории в список 'categories'
            result_data['categories'].append({'car_name': car_name, 'count': count, 'detail_names': detail_names})

        # Сериализация продуктов и добавление в список 'products'
        result_data['products'] = self.get_serializer(queryset, many=True).data

        return Response(result_data, status=status.HTTP_200_OK)


class CategoryListView2(generics.ListAPIView):
    serializer_class = CategoryWithProductCountSerializer

    def get_queryset(self):
        car_name = self.kwargs.get('car_name', None)

        queryset = Category.objects.annotate(product_count=Count('product'))

        if car_name:
            # If car name is provided, filter categories for that car
            queryset = queryset.filter(product__car_info__name=car_name)

        return queryset.distinct()
