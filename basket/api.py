from rest_framework import generics, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated

from basket.models import Order
from basket.serializers import OrderSerializer, OrderListSerializer, OrderAdminSerializer
from bot import send_order_notification
from products.api import CustomPageNumberPagination


class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        # Get the authenticated user if available, otherwise None
        user = self.request.user if self.request.user.is_authenticated else None

        # Save the order with the determined user
        serializer.save(user=user)


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

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
            send_order_notification(serializer)
        except ValidationError as e:
            # Handle validation errors if any
            pass


class OrderRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]
