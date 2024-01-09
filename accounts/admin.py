from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin

from accounts.forms import CustomUserCreationForm
from accounts.models import User


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    list_display = (
        'full_name', 'phone_number', 'role', 'email')
    list_display_links = ('full_name', 'phone_number', 'role')
    list_filter = ('full_name', 'phone_number', 'role')

    fieldsets = (
        (None, {'fields': (
            'full_name', 'password', 'email', 'photo',)}),
        ('Contact Information', {'fields': ('phone_number',)}),  # Оставьте только 'phone_number' здесь
        ('Permissions', {'fields': ('is_staff', 'is_active',
                                    'is_superuser', 'groups', 'user_permissions')}),

    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'full_name', 'email', 'phone_number', 'password1', 'password2', 'role',  'is_staff',
                'is_active', 'is_superuser',)}
         ),
    )
    search_fields = ('full_name', 'phone_number',)
    ordering = ('full_name',)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(id=request.user.id)

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        # Если пользователь не является суперпользователем и редактирует другого пользователя,
        # скрыть раздел 'Permissions'
        if not request.user.is_superuser and obj and not obj.is_superuser:
            fieldsets = fieldsets[:2]  # Оставляем только первые два раздела
        return fieldsets

    # def get_fieldsets(self, request, obj=None):
    #     fieldsets = super().get_fieldsets(request, obj)
    #     if not request.user.is_superuser:
    #         restricted_fields = ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')
    #         for fieldset in fieldsets:
    #             fields = fieldset[1]['fields']
    #             filtered_fields = [field for field in fields if field not in restricted_fields]
    #             fieldset[1]['fields'] = filtered_fields
    #     return fieldsets
    #
    # def get_readonly_fields(self, request, obj=None):
    #     readonly_fields = super().get_readonly_fields(request, obj)
    #     if not request.user.is_superuser:
    #         readonly_fields += ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')
    #     return readonly_fields


admin.site.register(User, CustomUserAdmin)