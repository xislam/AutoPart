from rest_framework import serializers

from products.models import CarMake, CarName, Product


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

    class Meta:
        model = Product
        fields = ['id', 'fotos', 'name_product', 'car_info', 'model_year', 'detail_number', 'v_i_n', 'code_product',
                  'product_information', 'external_color', 'old_price', 'new_price']



