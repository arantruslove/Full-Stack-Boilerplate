from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from accounts.serializers import UserSerializer


@api_view(["POST"])
def sign_up(request):
    """Handles the sign up of a new user."""

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            {"Response": "User signed up successfully.", "User": serializer.data},
            status=201,
        )
    else:
        return Response(serializer.errors, status=400)
