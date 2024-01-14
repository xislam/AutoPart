from django.contrib.auth.models import AnonymousUser
from rest_framework import serializers

from basket.models import Order
from products.models import Product


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        exclude = ['user']


class OrderListSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    create_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")  # Format the date as needed

    class Meta:
        model = Order
        fields = ['id', 'products', 'create_date', 'total']

    def get_products(self, obj):
        return ', '.join([product.name_product for product in obj.product.all()])
