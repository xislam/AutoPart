from rest_framework import generics, permissions, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from basket.models import Order
from basket.serializers import OrderSerializer, OrderListSerializer, OrderAdminSerializer
from bot import send_message_to_all_users
from products.api import CustomPageNumberPagination


class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        # Сначала сохраняем заказ
        order = serializer.save(user=self.request.user if self.request.user.is_authenticated else None)

        # Формируем текст уведомления
        order_info = f"New order: ID {order.id}\n"
        order_info += f"User: {order.name} {order.surname}\n"
        order_info += f"Phone: {order.phone}\n"
        order_info += "Products:\n"
        for product in order.product.all():
            order_info += f"  - {product.name}: {product.code}\n"
        order_info += f"Total: {order.total} $\n"
        order_info += f"Status: {order.status}\n"
        order_info += f"Created: {order.create_date}\n"

        # Отправляем уведомление в Telegram
        send_message_to_all_users(order_info)

class OrderListView(generics.ListAPIView):
    serializer_class = OrderListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve orders only for the authenticated user
        return Order.objects.filter(user=self.request.user)


class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class OrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]
    pagination_class = CustomPageNumberPagination

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save(user=request.user)
        print('sdfsdfasd asdf asdf asdf asdf asdf')
        # Формируем текст уведомления
        order_info = f"New order: ID {order.id}\n"
        order_info += f"User: {order.name} {order.surname}\n"
        order_info += f"Phone: {order.phone}\n"
        order_info += "Products:\n"
        for product in order.product.all():
            order_info += f"  - {product.name}: {product.code}\n"
        order_info += f"Total: {order.total} $\n"
        order_info += f"Status: {order.status}\n"
        order_info += f"Created: {order.create_date}\n"

        # Отправляем уведомление в Telegram
        send_message_to_all_users(order_info)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class OrderRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]
