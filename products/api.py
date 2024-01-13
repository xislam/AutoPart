from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from .models import Product, CarMake, CarName
from .serializers import ProductSerializer, CarMakeSerializer, CarNameSerializer

import django_filters


class ProductFilter(django_filters.FilterSet):
    model_year__gte = django_filters.NumberFilter(field_name='model_year', lookup_expr='gte')
    model_year__lte = django_filters.NumberFilter(field_name='model_year', lookup_expr='lte')

    class Meta:
        model = Product
        fields = {
            'name_product': ['icontains'],
            'car_info__car_name': ['icontains'],
        }


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ProductFilter


class CarMakeListView(generics.ListAPIView):
    queryset = CarMake.objects.all()
    serializer_class = CarMakeSerializer


class CarNameListView(generics.ListAPIView):
    queryset = CarName.objects.all()
    serializer_class = CarNameSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['car_make__make']
