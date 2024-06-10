from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from accounts.serializers import (
    UserSerializer,
    TokenObtainPairSerializer,
    EmailVerificationSerializer,
    PasswordResetSerializer,
    ActiveRefreshTokenSerializer,
)
from accounts.email import send_verification_email, send_password_reset_email
from accounts.models import EmailVerification, User, PasswordReset, ActiveRefreshToken


@api_view(["POST"])
def sign_up(request):
    """Handles the sign up of a new user."""

    with transaction.atomic():
        # Creates the User and EmailVerification instances
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
        else:
            return Response(user_serializer.errors, status=400)

        verification_serializer = EmailVerificationSerializer(data={"user": user.id})
        if verification_serializer.is_valid():
            verification = verification_serializer.save()
        else:
            return Response(verification_serializer.errors, status=400)

        # Sends the verification link in an email
        try:
            send_verification_email(user, verification.token)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

        return Response(
            {"response": "User signed up successfully.", "User": user_serializer.data},
            status=201,
        )


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
def obtain_token_pair(request):
    """
    Handles user login. Sets a refresh and access token as an http only cookie
    conditional on the user successfully logging in.
    """
    data = request.data.copy()  # Create a mutable copy of the data

    # Convert email to lowercase if it's in the data
    if "email" in data:
        data["email"] = data["email"].lower()

    serializer = TokenObtainPairSerializer(data=data)
    if serializer.is_valid(raise_exception=True):
        response_data = serializer.validated_data
    else:
        return Response(serializer.errors, status=400)

    response = Response(response_data, status=status.HTTP_200_OK)

    # Set refresh token as HTTP-only cookie
    refresh_token = response_data.get("refresh")
    if refresh_token:
        response.set_cookie(
            "rt_data",
            refresh_token,
            httponly=True,
            samesite="Lax",
            max_age=95 * 24 * 60 * 60,  # 95 days
        )

        # Getting the user by email
        try:
            user = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        # Save refresh token in the database
        token_serializer = ActiveRefreshTokenSerializer(
            data={"user": user.id, "token": refresh_token}
        )
        if token_serializer.is_valid():
            token_serializer.save()
        else:
            return Response(
                token_serializer.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # Set access token as HTTP-only cookie
    access_token = response_data.get("access")
    if access_token:
        response.set_cookie(
            "at_data",
            access_token,
            httponly=True,
            samesite="Lax",
        )

    return response


class TokenRefreshView(TokenRefreshView):
    """
    Refreshes the access token given the refresh token.
    """

    def post(self, request, *args, **kwargs):
        # Extract the refresh token from the cookie.
        refresh_token = request.COOKIES.get("rt_data")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token not provided in cookie"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Modify the request's data to inject the refresh token
        request.data["refresh"] = refresh_token

        # Get the response from the superclass
        response = super().post(request, *args, **kwargs)

        # If access token is present, set it as a cookie
        if response.data.get("access"):
            response.set_cookie(
                "at_data",
                response.data["access"],
                samesite="Lax",
            )

        response.data.pop("access", None)
        return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    """Log out user by removing their refresh and access tokens."""
    response = Response({"detail": "Cookie Deleted!"})
    response.delete_cookie("at_data")
    response.delete_cookie("rt_data")

    return response


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_user(request):
    """Hard deletion of the user's account."""

    # Deleting the user
    request.user.delete()
    response = Response({"detail": "User deleted"})

    # Deleting the cookies
    response.delete_cookie("at_data")
    response.delete_cookie("rt_data")

    return response


@api_view(["POST"])
def initiate_password_reset(request):
    """
    Initiates the password reset process by creating a PasswordReset model
    instance and sending the weblink to reset the password.
    """

    # Getting the user by email
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)

    except User.DoesNotExist:
        return Response(
            {"detail": "No user with the provided email."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Checking if there is already a password reset link that is yet to be used
    # Check for existing, unused password reset link
    existing_reset = PasswordReset.objects.filter(user=user).first()
    if existing_reset:
        return Response(
            {"detail": "A password reset link has already been sent."},
            status=status.HTTP_409_CONFLICT,
        )

    if user is None:
        return Response(
            {"detail": "No user with the provided username or email."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Proceed with password reset
    with transaction.atomic():
        serializer = PasswordResetSerializer(data={"user": user.id})
        if serializer.is_valid():
            password_reset = serializer.save()
        send_password_reset_email(user, password_reset.token)

    return Response({"detail": "Password reset email sent."})


@api_view(["POST"])
def complete_password_reset(request):
    """
    Completes the password reset when the user provides their new password.
    """
    new_password = request.data["new_password"]
    token = request.data["token"]

    # Getting the associated PasswordReset model instance by the token in the url
    try:
        password_reset = PasswordReset.objects.get(token=token)
    except:
        return Response(
            {"details": "The token provided is not valid."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Getting the user and changing its password
    user = password_reset.user

    # Blacklisting all refresh tokens
    refresh_token_instances = ActiveRefreshToken.objects.filter(user=user.id)
    for token_instance in refresh_token_instances:
        try:
            token = RefreshToken(token_instance.token)
            token.blacklist()
        except:
            pass
    refresh_token_instances.delete()

    user.set_password(new_password)
    user.save()

    password_reset.delete()

    return Response({"detail": "Your password has been changed."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def account_details(request):
    """Fetch the users account details."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
