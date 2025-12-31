from django.urls import path
from .views import football_news

urlpatterns = [
    path("football/", football_news),
]
