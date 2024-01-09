from django.contrib import admin

# Register your models here.
from rangefilter.filters import DateRangeFilter

from products.models import CarName, CarMake, Product, ExchangeRates


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


class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name_product', 'car_info', 'model_year', 'detail_number', 'v_i_n', 'code_product', 'external_color',
        'old_price',
        'new_price')
    list_filter = (
        IntegerRangeFilter, 'car_info', 'detail_number', 'v_i_n', 'code_product', 'external_color', 'old_price',
        'new_price')
    search_fields = ('car_info', 'detail_number', 'v_i_n', 'code_product', 'external_color', 'old_price',
                     'new_price')


admin.site.register(Product, ProductAdmin)
admin.site.register(ExchangeRates)
