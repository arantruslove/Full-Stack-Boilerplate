from django.core.mail import send_mail

from accounts.models import EmailVerification
from backend.config import config

BASE_URL = config["TRUSTED_ORIGINS"]


def send_verification_email(user, token):
    """
    Sends a verification email to a user and creates an EmailVerification object to
    track this.
    """

    # For tracking email verification
    verification_link = f"{BASE_URL}/verify-email/{token}"

    subject = "Verify your email"
    message = f"Click the link to verify your email: {verification_link}"
    html_content = f'<p>Click the link to verify your email: <a href="{verification_link}">Verify Email</a>'
    from_email = config["EMAIL_HOST_USER"]
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list, html_message=html_content)


def send_password_reset_email(user, token):
    """Sends a password reset email with a link to a page where a user can reset their
    password."""

    verification_link = f"{BASE_URL}/reset-password/{token}"

    subject = "Reset your password"
    message = f"Click the link to reset your password: {verification_link}"
    html_content = f'<p>Click the link to reset your password: <a href="{verification_link}">Reset password</a></p><p>username: {user.username}</p>'
    from_email = config["EMAIL_HOST_USER"]
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list, html_message=html_content)
