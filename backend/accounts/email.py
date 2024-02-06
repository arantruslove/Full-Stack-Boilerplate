from django.core.mail import send_mail

from accounts.models import EmailVerification
from backend.config import config

BASE_URL = config["TRUSTED_ORIGINS"]


def send_verification_email(user):
    """
    Sends a verification email to a user and creates an EmailVerification object to
    track this.
    """

    # For tracking email verification
    verification = EmailVerification.objects.create(user=user)
    unique_token = verification.token
    verification_link = f"{BASE_URL}/verify-email/{unique_token}"

    subject = "Verify your email"
    message = f"Click the link to verify your email: {verification_link}"
    html_content = f'<p>Click the link to verify your email: <a href="{verification_link}">Verify Email</a>'
    from_email = config["EMAIL_HOST_USER"]
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list, html_message=html_content)
