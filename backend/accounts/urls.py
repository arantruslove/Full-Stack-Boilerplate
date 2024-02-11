from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from accounts import views

urlpatterns = [
    path("sign-up/", views.sign_up, name="sign_up"),
    path("is-email-taken/", views.is_email_taken, name="is_email_taken"),
    path("verify-email/", views.verify_email, name="verify_email"),
    path("token/", views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
