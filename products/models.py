from django.db import models


# Create your models here.

# Курс валют также процент
class ExchangeRates(models.Model):
    percentage_field = models.DecimalField(max_digits=5, decimal_places=2, verbose_name='Процент')

    def __str__(self):
        return str(self.percentage_field)

    # 400 vow - 20 vow = 380 to usd = 30$ + percentage_field(50%) = 45$

    class Meta:
        verbose_name = 'Процент к курсу валюты'
        verbose_name_plural = 'Процент к курсу валюты'

    # эта модель марка машин


class CarMake(models.Model):
    make = models.CharField(verbose_name='Марка', max_length=125)
    create_date = models.DateTimeField(auto_now_add=True, verbose_name='Это создание')

    def __str__(self):
        return self.make

    class Meta:
        verbose_name = 'Марка машины'
        verbose_name_plural = 'Марка машины'


# название автомобиля
class CarName(models.Model):
    car_make = models.ForeignKey(CarMake, verbose_name='Марка машины', on_delete=models.CASCADE)
    car_name = models.CharField(max_length=250, verbose_name='Наименование машины')

    def __str__(self):
        return f'{self.car_make}/{self.car_name}'

    class Meta:
        verbose_name_plural = 'Наименование машины'
        verbose_name = 'Наименование машины'


class Category(models.Model):
    name = models.CharField(max_length=250, verbose_name='Наименование категории')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'


class Product(models.Model):
    product_id = models.CharField(max_length=40, null=True, blank=True)
    category = models.ForeignKey(Category, verbose_name='Категория', on_delete=models.CASCADE, null=True, blank=True)
    fotos = models.JSONField(default=list, null=True, blank=True, verbose_name='Ссылки на фотографии')
    name_product = models.CharField(max_length=225, verbose_name='Название Детали', blank=True, null=True)
    car_info = models.ForeignKey(CarName, verbose_name='Название производителя/название автомобиля',
                                 on_delete=models.CASCADE, related_name='car_info_r')
    model_year = models.IntegerField(verbose_name='Год модели', blank=True, null=True)
    detail_number = models.CharField(max_length=150, verbose_name='номер детали', blank=True, null=True)
    v_i_n = models.CharField(max_length=225, verbose_name='Идентификационный номер транспортного средства', blank=True,
                             null=True)
    code_product = models.CharField(max_length=225, verbose_name='Код продукта', blank=True, null=True)
    product_information = models.TextField(verbose_name='Информация о продукте', blank=True, null=True)
    external_color = models.CharField(verbose_name='Внешний цвет', max_length=100, blank=True, null=True)
    is_popular = models.BooleanField(default=False, verbose_name='Популярное')
    old_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Стара цена')
    price_in_won = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена на вон', blank=True,
                                       null=True)
    new_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Новая цена', null=True, blank=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return f'код продукта {self.code_product}'

    class Meta:
        verbose_name = 'Продукт'
        verbose_name_plural = 'Продукты'
