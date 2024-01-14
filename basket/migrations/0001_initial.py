# Generated by Django 5.0 on 2024-01-14 11:40

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('products', '0004_alter_product_car_info'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('neme', models.CharField(max_length=120, verbose_name='Имя')),
                ('surname', models.CharField(max_length=120, verbose_name='Фамилия')),
                ('address', models.CharField(max_length=120, verbose_name='Адрес')),
                ('additional_address', models.CharField(blank=True, max_length=120, null=True, verbose_name='Дополнительный адрес')),
                ('city', models.CharField(max_length=125, verbose_name='Город')),
                ('phone', models.CharField(max_length=21, verbose_name='Номер телефона')),
                ('total', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Сумма')),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='Создания')),
                ('product', models.ManyToManyField(to='products.product', verbose_name='Продукты')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
            options={
                'verbose_name': 'Заказы',
                'verbose_name_plural': 'Заказы',
            },
        ),
    ]
