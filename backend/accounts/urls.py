from django.urls import path
from accounts import views

urlpatterns = [
    path("test/", views.test),
]
