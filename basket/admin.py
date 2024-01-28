from django import forms
from django.contrib import admin

# Register your models here.
from basket.models import Order
from products.models import Product


class ProductInline(admin.TabularInline):
    model = Order.product.through
    verbose_name_plural = 'Products'
    verbose_name = 'Product'
    extra = 1

    template = 'admin/product_change_form.html'


class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'surname', 'status', 'create_date')
    list_filter = ('status', 'create_date')
    search_fields = ('name', 'surname', 'phone', 'status')
    date_hierarchy = 'create_date'
    ordering = ('-create_date',)
    inlines = [ProductInline]
    exclude = ('product',)


admin.site.register(Order, OrderAdmin)
