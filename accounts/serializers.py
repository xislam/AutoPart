from rest_framework import serializers, generics, permissions

from accounts.models import User, FavoriteProduct


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['phone_number', 'name', 'surname', 'role', 'email', 'birthday', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)


class PasswordResetSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=255, required=False)
    email = serializers.EmailField(required=False)


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'phone_number', 'name', 'surname', 'email', 'birthday', 'password']

    def update(self, instance, validated_data):
        # Update other fields
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.name = validated_data.get('name', instance.name)
        instance.surname = validated_data.get('surname', instance.surname)
        instance.email = validated_data.get('email', instance.email)
        instance.birthday = validated_data.get('birthday', instance.birthday)

        # Update password if provided
        password = validated_data.get('password')
        if password:
            instance.set_password(password)

        instance.save()
        return instance


class FavoriteProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteProduct
        exclude = ['user']


class FavoriteProductListSerializer(serializers.ModelSerializer):
    product_info = serializers.SerializerMethodField()

    class Meta:
        model = FavoriteProduct
        fields = ['product', 'product_info']

    def get_product_info(self, obj):
        product = obj.product
        # Customize this part based on your Product model fields
        return {
            'id': product.id,
            'name_product': product.name_product,
            'new_price': product.new_price,
            'old_price': product.old_price,
            # Add other fields as needed
        }
