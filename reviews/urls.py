from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from .views import ProductViewSet, ReviewViewSet, FeedbackViewSet, ReportViewSet
from .views import register, login, visualization_data, review_feedback, interface_feedback, generate_report_data, upload_review_file, classify_data

router = DefaultRouter()
# router.register(r'products', ProductViewSet)
# router.register(r'reviews', ReviewViewSet)
# router.register(r'feedbacks', FeedbackViewSet)
# router.register(r'reports', ReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('visualization/', visualization_data, name='visualization_data'),
    path('reviewfeedback/', review_feedback, name='review_feedback'),
    path('interfacefeedback/', interface_feedback, name='interface-feedback'),
    path('generatereportdata/', generate_report_data, name='generate_report_data'),
    path('upload-review-file/', upload_review_file, name='upload_review_file'),
    path('classify-data/', classify_data, name='classify_data'),
]
