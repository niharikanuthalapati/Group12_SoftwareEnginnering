from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission, UserManager as DefaultUserManager

class CustomUserManager(DefaultUserManager):
    """
    Custom manager for CustomUser.
    """
    def _create_user(self, email, password, **extra_fields):
        """
        Create and return a user with the given email and password.
        """
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a regular user with the given email and password.
        """
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)

        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self._create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    """
    Extended User model to cater to any additional fields.
    For instance, if you need more fields like DOB.
    """
    username = models.CharField(max_length=30, unique=False, blank=True, null=True)  # make username optional
    email = models.EmailField(unique=True, blank=False, null=False)  # add email field as unique
    dob = models.DateField(null=True, blank=True)
    # Override the groups and user_permissions fields
    groups = models.ManyToManyField(Group, blank=True, related_name="customuser_set")
    user_permissions = models.ManyToManyField(Permission, blank=True, related_name="customuser_set")


    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'username']  # username added here to ensure it's prompted during createsuperuser but can be left blank
    def save(self, *args, **kwargs):
        self.username = self.email
        super().save(*args, **kwargs)

class Product(models.Model):
    """
    Represents a product that can be reviewed.
    """
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    # Any other specific fields related to the product can be added here.

    def __str__(self):
        return self.name

class Review(models.Model):
    """
    Represents a user review for a product.
    """
    SENTIMENTS = (
        ('POS', 'Positive'),
        ('NEU', 'Neutral'),
        ('NEG', 'Negative'),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    content = models.TextField()
    sentiment = models.CharField(max_length=3, choices=SENTIMENTS, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Review for {self.product.name} by {self.user.username}"

class Feedback(models.Model):
    """
    Represents feedback generated for a review.
    """
    review = models.OneToOneField(Review, on_delete=models.CASCADE)
    actionable_feedback = models.TextField()

    def __str__(self):
        return f"Feedback for Review {self.review.id}"

class Report(models.Model):
    """
    Represents a downloadable report for reviews.
    """
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    generated_at = models.DateTimeField(auto_now_add=True)
    file_path = models.FileField(upload_to='reports/')

    def __str__(self):
        return f"Report for {self.user.username} at {self.generated_at}"
