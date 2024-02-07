from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from rest_framework import status

from accounts.serializers import UserSerializer
from accounts.email import send_verification_email
from accounts.models import EmailVerification


@api_view(["POST"])
def sign_up(request):
    """Handles the sign up of a new user."""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        # Make new user and send email verification
        try:
            with transaction.atomic():
                user = serializer.save()
                send_verification_email(user)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

        return Response(
            {"response": "User signed up successfully.", "User": serializer.data},
            status=201,
        )
    else:
        return Response(serializer.errors, status=400)


@api_view(["POST"])
def verify_email(request):
    """Verifies a users account by setting is_active = True."""
    try:
        with transaction.atomic():
            token = request.data["token"]

            # Setting the user as active and deleting its EmailVerification instance
            email_verification = EmailVerification.objects.get(token=token)
            user = email_verification.user
            user.is_verified = True
            user.save()
            email_verification.delete()

            return Response(
                {"response": "Account successfully verified."},
                status=status.HTTP_200_OK,
            )

    except EmailVerification.DoesNotExist:
        return Response(
            {"error": "Invalid verification token."}, status=status.HTTP_404_NOT_FOUND
        )
