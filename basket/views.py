from django.shortcuts import render

# Create your views here.
from django.views.generic import TemplateView

from accounts.models import SocialNetwork, Contacts


class AdminOrderpageHTMLView(TemplateView):
    template_name = 'autopart/admin.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)

        context['social_network'] = SocialNetwork.objects.first()
        context['contact'] = Contacts.objects.first()

        return context


class AdminPageOrderpageHTMLView(TemplateView):
    template_name = 'autopart/adminPage.html'

    def get_context_data(self, *, object_list=None, **kwargs):
        context = super().get_context_data(**kwargs)

        context['social_network'] = SocialNetwork.objects.first()
        context['contact'] = Contacts.objects.first()

        return context
