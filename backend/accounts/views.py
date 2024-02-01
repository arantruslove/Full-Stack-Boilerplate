from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.


@api_view(["GET"])
def test(request):
    """Simple view to test endpoint."""
    data = {"Response": "This is the first API response."}

    return Response(data)
