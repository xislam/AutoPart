# Generated by Django 5.0 on 2024-01-14 05:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0003_alter_carmake_create_date_alter_carmake_make_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='car_info',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='car_info_r', to='products.carname', verbose_name='Название производителя/название автомобиля'),
        ),
    ]