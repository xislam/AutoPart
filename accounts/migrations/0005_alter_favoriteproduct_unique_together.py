# Generated by Django 5.0 on 2024-01-15 14:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_favoriteproduct'),
        ('products', '0007_category_product_category'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='favoriteproduct',
            unique_together={('user', 'product')},
        ),
    ]
