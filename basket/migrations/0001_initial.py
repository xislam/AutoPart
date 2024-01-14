# Generated by Django 5.0 on 2024-01-11 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('products', '0003_alter_carmake_create_date_alter_carmake_make_and_more'),
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
                ('Total', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Сумма')),
                ('create_date', models.DateTimeField(auto_now_add=True, verbose_name='Создания')),
                ('product', models.ManyToManyField(to='products.product', verbose_name='Продукты')),
            ],
            options={
                'verbose_name': 'Заказы',
                'verbose_name_plural': 'Заказы',
            },
        ),
    ]