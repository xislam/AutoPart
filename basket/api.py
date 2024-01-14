from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from basket.models import Order
from basket.serializers import OrderSerializer, OrderListSerializer


class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        # Check if there's an authenticated user
        user = self.request.user if self.request.user.is_authenticated else None

        # Save the order with the determined user
        serializer.save(user=user)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve orders only for the authenticated user
        return Order.objects.filter(user=self.request.user)
