from django.contrib.auth.models import AnonymousUser
from rest_framework import serializers

from basket.models import Order
from products.models import Product
from products.serializers import ProductSerializer


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault(), required=False)

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        user = self.context['request'].user if self.context['request'].user.is_authenticated else None
        validated_data['user'] = user
        return super(OrderSerializer, self).create(validated_data)


class OrderListSerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()
    create_date = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")  # Format the date as needed

    class Meta:
        model = Order
        fields = ['id', 'products', 'create_date', 'total', 'status']

    def get_products(self, obj):
        return ', '.join([product.name_product for product in obj.product.all()])


class OrderAdminSerializer(serializers.ModelSerializer):
    product = ProductSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'
