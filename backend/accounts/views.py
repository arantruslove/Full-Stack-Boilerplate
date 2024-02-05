from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.


@api_view(["GET"])
def test(request):
    """Simple view to test endpoints."""
    data = {"Response": "This is the first API response."}

    return Response(data)


@api_view(["GET"])
def sign_up(request):
    """Handles the sign up of a new user."""
    data = {"Response": "A user will be signed up."}

    return Response(data)
