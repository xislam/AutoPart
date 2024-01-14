from django.db.models import Count, Subquery, OuterRef
from django.db.models.functions import Concat
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, status
from rest_framework.response import Response
from django.db.models import Count, Value, CharField

from basket.models import Order
from .models import Product, CarMake, CarName, Category
from .serializers import ProductSerializer, CarMakeSerializer, CarNameSerializer, CategorySerializer

import django_filters


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
        filters = [django_filters.filters.Q(name_product__icontains=name) for name in names]
        combined_filters = filters.pop()
        for f in filters:
            combined_filters |= f
        return queryset.filter(combined_filters)


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.exclude(
        id__in=Subquery(Order.objects.filter(product=OuterRef('id')).values('product'))
    )
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

        result_data = self.get_serializer(queryset, many=True).data
        for item in model_counts:
            car_name = item['car_info__car_name']
            count = item['count']
            detail_names = item['detail_names']
            result_data.append({'car_name': car_name, 'count': count, 'detail_names': detail_names})

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


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
