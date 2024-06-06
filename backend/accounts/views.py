from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

from accounts.serializers import UserSerializer, TokenObtainPairSerializer
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


class TokenObtainPairView(TokenObtainPairView):
    """
    Handles user login. Sets a refresh and access token as an http only cookie
    conditional on the user successfully logging in.
    """

    serializer_class = TokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        data = request.data.copy()  # Create a mutable copy of the data

        # Convert username to lowercase if it's in the data
        if "username" in data:
            data["username"] = data["username"].lower()

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        response_data = serializer.validated_data

        response = Response(response_data, status=status.HTTP_200_OK)

        # Check if refresh token is present in the response data
        if response.data.get("refresh"):
            response.set_cookie(
                "rt_data",
                response.data["refresh"],
                httponly=True,
                samesite="Lax",
                expires=95 * 24 * 60 * 60,
            )
            del response.data["refresh"]

        if response.data.get("access"):
            response.set_cookie(
                "at_data",
                response.data["access"],
                httponly=True,
                samesite="Lax",
            )
            del response.data["access"]

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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def account_details(request):
    """Fetch the users account details (only email currently)."""
    return Response({"email": request.user.email})
