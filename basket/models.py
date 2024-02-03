from django.db import models

# Create your models here.
from django.db.models.signals import post_save
from django.dispatch import receiver

from accounts.models import User
from bot import send_order_notification
from products.models import Product


class Order(models.Model):
    STATUS_CHOICES = [
        ('в_обработке', 'В обработке'),
        ('ожидание', 'Ожидание'),
        ('отправлено', 'Отправлено'),
        ('доставлено', 'Доставлено'),
        ('оплачено', 'Оплачено'),
        ('не_оплачено', 'Не оплачено'),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Пользователь')
    name = models.CharField(max_length=120, verbose_name='Имя')
    surname = models.CharField(max_length=120, verbose_name='Фамилия')
    address = models.CharField(max_length=120, verbose_name='Адрес')
    additional_address = models.CharField(max_length=120, verbose_name='Дополнительный адрес', null=True, blank=True)
    city = models.CharField(max_length=125, verbose_name='Город')
    phone = models.CharField(max_length=21, verbose_name='Номер телефона')
    total = models.DecimalField(max_digits=8, decimal_places=2, verbose_name='Сумма')
    status = models.CharField(max_length=45, verbose_name='Статус', choices=STATUS_CHOICES, default='ожидание')
    product = models.ManyToManyField(Product,
                                      verbose_name='Товары', related_name='orders')
    create_date = models.DateTimeField(auto_now_add=True, verbose_name='Создания')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Заказы'
        verbose_name = 'Заказы'



