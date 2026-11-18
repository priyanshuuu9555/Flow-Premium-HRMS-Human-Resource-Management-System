
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token

from .models import UserProfile
from .serializers import RegisterSerializer


def get_user_role(user):
    if user.is_superuser:
        return 'Admin'

    profile, _ = UserProfile.objects.get_or_create(
        user=user,
        defaults={'role': 'Employee'}
    )
    return profile.role


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()

            return Response({
                'message': 'Registration successful',
                'email': user.email
            }, status=status.HTTP_201_CREATED)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        user = User.objects.filter(
            email__iexact=email
        ).first()

        if not user:
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        authenticated_user = authenticate(
        request=request,
        username=user.username,
        password=password
        )

        if not authenticated_user:
            return Response(
                {'error': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not authenticated_user.is_active:
            return Response(
                {'error': 'This account is inactive'},
                status=status.HTTP_403_FORBIDDEN
            )

        role = get_user_role(authenticated_user)
        token, _ = Token.objects.get_or_create(
            user=authenticated_user
        )

        return Response({
            'token': token.key,
            'user': {
                'id': str(authenticated_user.id),
                'name': authenticated_user.get_full_name()
                        or authenticated_user.username,
                'email': authenticated_user.email,
                'role': role,
                'avatarColor': '#0EA5E9'
            }
        })


class LogoutView(APIView):
    def post(self, request):
        request.auth.delete()
        return Response({'message': 'Logged out successfully'})
