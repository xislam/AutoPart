from django.contrib.auth.models import AnonymousUser
from rest_framework import serializers

from basket.models import Order
from products.models import Product


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        products_data = validated_data.pop('products', [])  # Extract the product data

        # Check if there's an authenticated user
        user = None
        if self.context.get('request') and self.context['request'].user.is_authenticated:
            user = self.context['request'].user

        order = Order.objects.create(user=user, **validated_data)

        # Add products to the order using the many-to-many relationship
        for product_data in products_data:
            product = Product.objects.get(pk=product_data['id'])
            order.products.add(product)

        return order
