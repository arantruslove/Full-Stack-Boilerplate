from django.urls import reverse
from rest_framework.test import APIClient
from django.test import TestCase


class SignUp(TestCase):

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
