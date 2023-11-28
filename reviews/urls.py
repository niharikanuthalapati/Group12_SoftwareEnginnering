from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import register, login, review_feedback, interface_feedback, generate_report_data, upload_review_file, classify_data

router = DefaultRouter()
urlpatterns = [
    path('', include(router.urls)),
    path('register-api/', register, name='register'),
    path('login-api/', login, name='login'),
    path('reviewfeedback/', review_feedback, name='review_feedback'),
    path('interfacefeedback/', interface_feedback, name='interface-feedback'),
    path('generatereportdata/', generate_report_data, name='generate_report_data'),
    path('upload-review-file/', upload_review_file, name='upload_review_file'),
    path('classify-data/', classify_data, name='classify_data'),
]
