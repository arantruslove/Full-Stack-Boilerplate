from django.urls import path
from accounts import views

urlpatterns = [
    path("sign-up/", views.sign_up, name="sign_up"),
]
