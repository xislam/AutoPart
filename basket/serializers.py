from django.contrib.auth.models import AnonymousUser
from rest_framework import serializers

from basket.models import Order
from products.models import Product


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        exclude = ['user']

