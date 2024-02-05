from django.contrib.auth import get_user_model
from rest_framework import serializers

# Getting custom User model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "is_active"]
