from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission, UserManager as DefaultUserManager
import hashlib
import uuid
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify


class CustomUserManager(DefaultUserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)

        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self._create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
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

class ReviewFile(models.Model):
    user_email = models.EmailField()
    file = models.FileField(upload_to='uploads/')
    file_name = models.CharField(max_length=255)
    created_date = models.DateTimeField(auto_now_add=True)
    unique_id = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)

    def save(self, *args, **kwargs):
        if not self.id:
            # Generate a unique file name using a hash of the file content
            self.file.seek(0)
            file_content = self.file.read()
            file_hash = hashlib.md5(file_content).hexdigest()
            original_name = self.file.name
            self.file_name = original_name
            new_name = f"{self.user_email}_{self.unique_id}_{file_hash}{self.file.name[self.file.name.rfind('.'):]}"

            if ReviewFile.objects.filter(file=new_name).exists():
                self.file.name = new_name

        super(ReviewFile, self).save(*args, **kwargs)

    def __str__(self):
        return self.file.name
    
    
class FileOutput(models.Model):
    review_file = models.ForeignKey(ReviewFile, on_delete=models.CASCADE)
    review_text = models.TextField()
    sentiment_summary = models.JSONField()

    def __str__(self):
        return self.review_file.file_name

class UserInterfaceFeedback(models.Model):
    comment = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    review_file = models.ForeignKey(ReviewFile, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Feedback for {self.review_file.file.name}"

class ReviewFeedback(models.Model):
    comment = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    review_file = models.ForeignKey(ReviewFile, on_delete=models.SET_NULL, null=True)
    star_rating = models.PositiveIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    def __str__(self):
        return f"Review for {self.review_file.file.name}"

class ReportGenerated(models.Model):
    generated_at = models.DateTimeField(auto_now_add=True)
    file_path = models.FileField(upload_to='reports/')
    review_file = models.ForeignKey(ReviewFile, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Report for {self.review_file.file.name} at {self.generated_at}"
    
# class Product(models.Model):
#     name = models.CharField(max_length=255)
#     description = models.TextField(null=True, blank=True)
#     # Any other specific fields related to the product can be added here.

#     def __str__(self):
#         return self.name

# class Review(models.Model):
#     SENTIMENTS = (
#         ('POS', 'Positive'),
#         ('NEU', 'Neutral'),
#         ('NEG', 'Negative'),
#     )

#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     content = models.TextField()
#     sentiment = models.CharField(max_length=3, choices=SENTIMENTS, null=True, blank=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return f"Review for {self.product.name} by {self.user.username}"

# class Feedback(models.Model):
#     review = models.OneToOneField(Review, on_delete=models.CASCADE)
#     actionable_feedback = models.TextField()

#     def __str__(self):
#         return f"Feedback for Review {self.review.id}"

# class Report(models.Model):
#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     generated_at = models.DateTimeField(auto_now_add=True)
#     file_path = models.FileField(upload_to='reports/')

#     def __str__(self):
#         return f"Report for {self.user.username} at {self.generated_at}"


# class ReviewFeedback(models.Model):
#     email = models.EmailField()
#     starRating = models.IntegerField()
#     comment = models.TextField()
#     createdDate = models.DateTimeField(auto_now_add=True)


# class InterfaceFeedback(models.Model):
#     email = models.EmailField()
#     comment = models.TextField()
#     createdDate = models.DateTimeField(auto_now_add=True)