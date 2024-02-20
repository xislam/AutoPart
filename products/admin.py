from django.contrib import admin

# Register your models here.
from django.contrib.admin import SimpleListFilter
from rangefilter.filters import DateRangeFilter

from products.models import CarName, CarMake, Product, ExchangeRates, Category


class CarMakeAdmin(admin.ModelAdmin):
    list_display = ('make', 'create_date')
    search_fields = ['make']


admin.site.register(CarMake, CarMakeAdmin)


class CarNameAdmin(admin.ModelAdmin):
    list_display = ('car_make', 'car_name')
    search_fields = ['car_make__make', 'car_name']


admin.site.register(CarName, CarNameAdmin)


class IntegerRangeFilter(admin.SimpleListFilter):
    title = 'Год модели (от и до)'
    parameter_name = 'year_range'

    def lookups(self, request, model_admin):
        return [
            ('2000-2005', '2000-2005'),
            ('2006-2010', '2006-2010'),
            ('2011-2015', '2011-2015'),
            ('2015-2020', '2015-2020'),
            ('2020-2024', '2020-2024'),

        ]

    def queryset(self, request, queryset):
        if self.value():
            start_year, end_year = map(int, self.value().split('-'))
            return queryset.filter(model_year__range=(start_year, end_year))


class PriceRangeFilter(SimpleListFilter):
    title = 'Price Range'
    parameter_name = 'price_range'

    def lookups(self, request, model_admin):
        return (
            ('low', 'Low Price'),
            ('medium', 'Medium Price'),
            ('high', 'High Price'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'low':
            return queryset.filter(old_price__lt=100)  # Например, здесь вы можете указать свой диапазон цен
        elif self.value() == 'medium':
            return queryset.filter(old_price__gte=100, old_price__lte=500)
        elif self.value() == 'high':
            return queryset.filter(old_price__gt=500)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name_product', 'model_year', 'detail_number', 'v_i_n', 'code_product', 'external_color',
        'old_price',
        'new_price')
    list_filter = (
        'car_info', 'detail_number', 'v_i_n', 'code_product', 'external_color', 'old_price',
        'new_price', PriceRangeFilter)
    list_per_page = 50
    autocomplete_fields = ['car_info', 'category']
    search_fields = ('code_product',)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('car_info').order_by('name_product')


admin.site.register(ExchangeRates)
admin.site.register(Category)
