# Generated by Django 5.0 on 2024-01-29 16:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('basket', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='order',
            old_name='products',
            new_name='product',
        ),
    ]
