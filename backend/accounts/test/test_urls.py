from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase
from django.core.exceptions import ObjectDoesNotExist

from accounts.models import User, EmailVerification


class SignUp(TestCase):
    """Testing the sign-up endpoint."""

    def setUp(self):
        self.client = APIClient()
        self.url = reverse("sign_up")  # Resolves to /sign-up/

    def test_successful_sign_up(self):
        data = {
            "email": "newuser@example.com",
            "password": "testpassword123",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 201)

    def test_no_email(self):
        data = {
            "password": "testpassword123",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_invalid_email(self):
        data = {
            "email": "invalid-email",
            "password": "testpassword123",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_email_verification_creation(self):
        data = {
            "email": "newuser@example.com",
            "password": "testpassword123",
        }
        self.client.post(self.url, data, format="json")

        user = User.objects.get(email="newuser@example.com")
        email = EmailVerification.objects.get(user=user)
        self.assertEqual(email.user, user)


class VerifyEmail(TestCase):
    """Testing the verify-email endpoint."""

    def setUp(self):
        self.client = APIClient()
        self.url = reverse("verify_email")

        # Signing up a user
        data = {
            "email": "newuser@example.com",
            "password": "testpassword123",
        }
        sign_up_url = reverse("sign_up")
        self.client.post(sign_up_url, data, format="json")
        self.user = User.objects.get(email="newuser@example.com")

        verification = EmailVerification.objects.get(user=self.user)
        self.token = verification.token

    def test_successful_email_verification(self):
        data = {"token": self.token}
        response = self.client.post(self.url, data, format="json")
        self.user.refresh_from_db()

        with self.assertRaises(EmailVerification.DoesNotExist):
            EmailVerification.objects.get(user=self.user)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.user.is_verified, True)
