from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.db.models import Q

from products.models import Product


class UserManager(BaseUserManager):
    def create_user(self, phone_number, name, password=None, email=None, **extra_fields):
        if not phone_number:
            raise ValueError('Необходимо указать номер телефона')

        if email is None:
            email = ''  # Установить email в пустую строку, если не передан

        user = self.model(phone_number=phone_number, name=name, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, name, password, email, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.ROLE_ADMINISTRATOR)
        return self.create_user(phone_number, name, password, email, **extra_fields)

    def get_by_username(self, username):
        return self.get(Q(phone_number=username) | Q(email=username))


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_ADMINISTRATOR = 'administrator'
    ROLE_USER = 'user'

    ROLE_CHOICES = [
        (ROLE_ADMINISTRATOR, 'Администратор'),
        (ROLE_USER, 'Пользователь'),
    ]

    phone_number = models.CharField(max_length=255, verbose_name='Телефон', unique=True)
    name = models.CharField(verbose_name='Имя', max_length=50)
    surname = models.CharField(max_length=255, verbose_name='Фамилия')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, verbose_name='Роль', default=ROLE_USER)
    email = models.EmailField(unique=True, verbose_name='Почта', null=True, blank=True)
    birthday = models.DateField(verbose_name='День рождения', null=True, blank=True)
    is_active = models.BooleanField(default=True, verbose_name='Активный')
    is_staff = models.BooleanField(default=False, verbose_name='Сотрудник')
    is_superuser = models.BooleanField(default=False, verbose_name='Администратор')
    push_phone = models.BooleanField(default=False, verbose_name='Push - уведомления и SMS')
    push_email = models.BooleanField(default=False, verbose_name='Присылать уведомления на почту')
    is_online = models.BooleanField(default=False)
    objects = UserManager()

    USERNAME_FIELD = 'phone_number'
    REQUIRED_FIELDS = ['name', 'email']

    def __str__(self):
        if self.name:
            return str(f"{self.name} номер: {self.phone_number}")
        else:
            return f"Номер: {self.phone_number}"

    def get_username(self):
        return self.phone_number

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'


class FavoriteProduct(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['user', 'product']



class SocialNetwork(models.Model):
    title = models.CharField(max_length=40, verbose_name='заголовок')
    instagram = models.URLField(verbose_name='Instagram')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'соцсети'
        verbose_name_plural = 'соцсети'


class Contacts(models.Model):
    phone_number = models.CharField(max_length=13, verbose_name='Номер телефона')
    email = models.EmailField()

    def __str__(self):
        return self.phone_number

    class Meta:
        verbose_name = 'Контакты'
        verbose_name_plural = 'Контакты'