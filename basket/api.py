from rest_framework import generics

from basket.models import Order
from basket.serializers import OrderSerializer


class OrderListView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
