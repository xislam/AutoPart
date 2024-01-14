from rest_framework import generics

from basket.models import Order
from basket.serializers import OrderSerializer


class OrderListView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def perform_create(self, serializer):
        # Check if there's an authenticated user
        user = self.request.user if self.request.user.is_authenticated else None

        # Save the order with the determined user
        serializer.save(user=user)
