from django.core.mail import send_mail
from django.db.models import Q
from drf_yasg.utils import swagger_auto_schema
from rest_framework import generics, permissions, status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, FavoriteProduct
from .serializers import UserRegistrationSerializer, UserLoginSerializer, PasswordResetSerializer, UserSerializer, \
    FavoriteProductSerializer, FavoriteProductListSerializer


class RegistrationAPIView(generics.CreateAPIView):
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        tokens = {
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }

        response_data = {
            'tokens': tokens,
            'user': serializer.data,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)


class UserLoginAPIView(generics.CreateAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(request_body=UserLoginSerializer)
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        identifier = serializer.validated_data['identifier']
        password = serializer.validated_data['password']

        user = User.objects.get(Q(phone_number=identifier) | Q(email=identifier))

        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            data = {
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
                'user_id': user.id,
                'username': user.email,
                'is_superuser': user.is_superuser,

                # Add other user-related fields as needed
            }

            serializer.validated_data['tokens'] = data
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class CustomPasswordResetView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone_number = serializer.validated_data.get('phone_number')
        email = serializer.validated_data.get('email')

        # Проверка, предоставлен ли номер телефона или адрес электронной почты
        if not phone_number and not email:
            return Response({'detail': 'Укажите либо номер телефона, либо адрес электронной почты для сброса пароля.'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Поиск пользователя по номеру телефона или адресу электронной почты
        user = None
        if phone_number:
            user = User.objects.filter(phone_number=phone_number).first()
        elif email:
            user = User.objects.filter(email=email).first()

        if not user:
            return Response({'detail': 'Пользователь не найден.'}, status=status.HTTP_404_NOT_FOUND)

        # Генерация нового пароля (больше восьми символов)
        new_password = User.objects.make_random_password(length=12)  # Пример: генерация пароля длиной 12 символов

        # Установка нового пароля для пользователя
        user.set_password(new_password)
        user.save()

        recipient_email = user.email  # Проверьте, что user.email содержит корректный адрес

        # Тема и текст письма
        subject = 'Сброс пароля'
        message = f'Ваш новый пароль: {new_password}'

        print(recipient_email)
        send_mail(subject, message, 'your_email@example.com', [recipient_email], fail_silently=False)

        return Response({'detail': 'Сброс пароля прошел успешно. Новый пароль отправлен на вашу электронную почту.'},
                        status=status.HTTP_200_OK)


class UserUpdateView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Retrieve the user associated with the JWT token
        return self.request.user


class FavoriteProductListCreateView(generics.CreateAPIView):
    serializer_class = FavoriteProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return the favorite products of the authenticated user
        return FavoriteProduct.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Set the user to the authenticated user before saving the favorite product
        serializer.save(user=self.request.user)


class FavoriteProductDeleteView(generics.DestroyAPIView):
    serializer_class = FavoriteProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return the favorite products of the authenticated user
        return FavoriteProduct.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class FavoriteProductListView(generics.ListAPIView):
    serializer_class = FavoriteProductListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Retrieve the favorite products for the authenticated user
        user = self.request.user
        return FavoriteProduct.objects.filter(user=user)
