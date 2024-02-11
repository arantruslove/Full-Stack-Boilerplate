from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from rest_framework import status
from django.contrib.auth import get_user_model, login

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


@api_view(["GET"])
def is_email_taken(request):
    """Checks if there is already a user with the email."""
    email = request.query_params.get("email")
    if email is None:
        return Response({"error": "No 'email' field has been provided."}, status=500)

    User = get_user_model()
    is_taken = User.objects.filter(email=email).exists()

    if is_taken:
        return Response({"response": True})
    else:
        return Response({"response": False})


@api_view(["POST"])
def verify_email(request):
    """Verifies a users account by setting is_active = True."""
    try:
        with transaction.atomic():
            token = request.data.get("token")

            # Setting the user as active and deleting its EmailVerification instance
            email_verification = EmailVerification.objects.get(token=token)
            user = email_verification.user
            user.is_verified = True
            user.save()
            email_verification.delete()

            return Response(
                {"response": "Account successfully verified."},
            )

    except EmailVerification.DoesNotExist:
        return Response(
            {"error": "Invalid verification token."}, status=status.HTTP_404_NOT_FOUND
        )


@api_view(["POST"])
def login_view(request):
    """
    Logs the user in by setting an authentication cookie on the frontend
    and creating a session in the database.
    """
    User = get_user_model()
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # If no user is found, return an invalid credentials response
        return Response({"error": "Invalid credentials."}, status=401)

    # Check if the provided password is correct
    if user is not None and user.check_password(password):
        login(request, user)
        return Response({"response": "Login successful."}, status=200)

    # If authentication fails, return an error response
    else:
        return Response({"error": "Invalid credentials."}, status=401)
