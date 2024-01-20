from django.contrib.auth.models import AnonymousUser
from rest_framework import serializers

from accounts.models import FavoriteProduct
from products.models import CarMake, CarName, Product, Category


class CarMakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarMake
        fields = ['id', 'make', 'create_date']


class CarNameSerializer(serializers.ModelSerializer):
    car_make = CarMakeSerializer()

    class Meta:
        model = CarName
        fields = ['id', 'car_make', 'car_name']


class ProductSerializer(serializers.ModelSerializer):
    car_info = CarNameSerializer()
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'fotos', 'name_product', 'car_info', 'model_year', 'detail_number', 'v_i_n', 'code_product',
                  'product_information', 'external_color', 'old_price', 'new_price', 'is_favorite']

    def get_is_favorite(self, obj):
        # Получаем текущего пользователя
        user = self.context['request'].user

        # Проверяем, добавлен ли продукт в избранное для данного пользователя
        if isinstance(user, AnonymousUser) or not user.is_authenticated:
            # If the user is anonymous or not authenticated, return False
            return False

        return FavoriteProduct.objects.filter(user=user, product=obj).exists()

class ProductWithCountSerializer(serializers.Serializer):
    name_product = serializers.CharField(source='name_product.name_product', read_only=True)
    count = serializers.IntegerField()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductDitailSerializer(serializers.ModelSerializer):
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_is_favorite(self, obj):
        # Получаем текущего пользователя
        user = self.context['request'].user

        # Проверяем, добавлен ли продукт в избранное для данного пользователя
        return FavoriteProduct.objects.filter(user=user, product=obj).exists()
