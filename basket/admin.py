from django import forms
from django.contrib import admin

from basket.models import Order


class ProductInline(admin.TabularInline):
    model = Order.product.through
    verbose_name_plural = 'Products'
    verbose_name = 'Product'
    extra = 1
    autocomplete_fields = ('product',)

    template = 'admin/product_change_form.html'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('name', 'surname', 'status', 'create_date')
    list_filter = ('status', 'create_date')
    search_fields = ('name', 'surname', 'address', 'city', 'phone')
    inlines = [ProductInline]
