# Generated by Django 5.0 on 2024-01-24 05:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0010_product_price_in_won'),
    ]

    operations = [
        migrations.AddField(
            model_name='product',
            name='deleted',
            field=models.BooleanField(default=False),
        ),
    ]