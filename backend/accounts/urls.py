from django.urls import path

from accounts import views

urlpatterns = [
    path("sign-up/", views.sign_up, name="sign_up"),
    path("is-email-taken/", views.is_email_taken, name="is_email_taken"),
    path("verify-email/", views.verify_email, name="verify_email"),
    path("token/", views.obtain_token_pair, name="token_obtain_pair"),
    path("token/refresh/", views.TokenRefreshView.as_view(), name="token_refresh"),
    path("account-details/", views.account_details, name="account_details"),
    path("logout/", views.logout, name="logout"),
    path("delete-user/", views.delete_user, name="delete_user"),
    path(
        "initiate-password-reset/",
        views.initiate_password_reset,
        name="initiate_password_reset",
    ),
    path(
        "reset-password/", views.complete_password_reset, name="complete_password_reset"
    ),
]
