from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Setup admin user for the application'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Admin email (used as username)')
        parser.add_argument('password', type=str, help='Admin password')

    def handle(self, *args, **options):
        email = options['email']
        password = options['password']

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f'Admin with email "{email}" already exists'))
            return

        # Create admin user with email as username
        user = User.objects.create_user(
            username=email,  # Use email as username
            email=email,
            password=password,
            is_staff=True,
            is_superuser=True
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created admin user with email "{email}"'
            )
        )

