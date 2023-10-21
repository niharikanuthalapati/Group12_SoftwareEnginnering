from django.contrib import admin
from .models import CustomUser, ReviewFile, FileOutput, UserInterfaceFeedback, ReviewFeedback, ReportGenerated

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'dob')

@admin.register(ReviewFile)
class ReviewFileAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'file', 'created_date', 'unique_id')
    search_fields = ('user_email', 'unique_id')

@admin.register(FileOutput)
class FileOutputAdmin(admin.ModelAdmin):
    list_display = ('review_file', 'review_text', 'sentiment_summary')
    search_fields = ('review_file__file', 'review_text')

@admin.register(UserInterfaceFeedback)
class UserInterfaceFeedbackAdmin(admin.ModelAdmin):
    list_display = ('comment', 'created_date', 'review_file')
    search_fields = ('comment', 'review_file__file')

@admin.register(ReviewFeedback)
class ReviewFeedbackAdmin(admin.ModelAdmin):
    list_display = ('comment', 'created_date', 'review_file', 'star_rating')
    search_fields = ('comment', 'review_file__file', 'star_rating')

@admin.register(ReportGenerated)
class ReportGeneratedAdmin(admin.ModelAdmin):
    list_display = ('generated_at', 'file_path', 'review_file')
    search_fields = ('review_file__file',)