from .models import CustomUser, ReviewFile, FileOutput, UserInterfaceFeedback, ReviewFeedback, ReportGenerated
from .serializers import CustomUserSerializer, ReviewFileSerializer, FileOutputSerializer, UserInterfaceFeedbackSerializer, ReviewFeedbackSerializer, ReportGeneratedSerializer
from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
from rest_framework import status
from reviews.Classifier import Classifier
from reviews.data_analyzer import DataAnalyzer
from django.conf import settings
import os

import time
classifier = Classifier()

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    if request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Registration successful"}, status=201)
        return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    if request.method == 'POST':
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user:
            # Getting user details
            User = get_user_model()
            user_details = User.objects.filter(email=email).values('id', 'email', 'first_name', 'last_name').first()
            return Response({"message": "Login successful", "user": user_details})
        return Response({"error": "Invalid email or password"}, status=400)


@api_view(['GET'])
@permission_classes([AllowAny])
def visualization_data(request):
    # Sample data for visualization
    data = {
        'labels': ['Positive', 'Neutral', 'Negative'],
        'datasets': [{
            'data': [50, 30, 20],
            'backgroundColor': ['green', 'yellow', 'red'],
        }]
    }
    return Response(data)



@api_view(['POST'])
def review_feedback(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)

        # Convert the unique_id string to a ReviewFile instance
        unique_id = data.get('review_file')
        try:
            review_file = ReviewFile.objects.get(unique_id=unique_id)
            data['review_file'] = review_file.id
        except ReviewFile.DoesNotExist:
            return JsonResponse({'error': 'File is not uploaded. Please upload the file first.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ReviewFeedbackSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Feedback submitted successfully!'}, status=201)
        return JsonResponse(serializer.errors, status=400)

@api_view(['POST'])
def interface_feedback(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)

        # Convert the unique_id string to a ReviewFile instance
        unique_id = data.get('review_file')
        try:
            review_file = ReviewFile.objects.get(unique_id=unique_id)
            data['review_file'] = review_file.id
        except ReviewFile.DoesNotExist:
            return Response({'error': 'File is not uploaded. Please upload the file first.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserInterfaceFeedbackSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Feedback submitted successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def generate_report_data(request):
    sample_data = {
        "title": "Sample Report",
        "total_reviews": 150,
        "positive_reviews": 100,
        "negative_reviews": 50,
        "average_rating": 4.2,
        "suggestions": [
            "Improve UI",
            "Add dark mode feature",
            "Reduce app crashes"
        ]
    }
    return Response(sample_data)



@api_view(['POST'])
@permission_classes([AllowAny])
def upload_review_file(request):
    if request.method == 'POST':
        serializer = ReviewFileSerializer(data=request.data)
        if serializer.is_valid():
            user_email = request.data.get('user_email')
            serializer.save(user_email=user_email)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def classify_data(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        if data:
            file_id = data.get('id')
            try:
                review_file = ReviewFile.objects.get(id=file_id)
            except ReviewFile.DoesNotExist:
                return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)

            output = classifier.classify(data)
            file_path = os.path.join(settings.MEDIA_ROOT, 'uploads', os.path.basename(data['file']))
            file_path = file_path.replace('\\', '/')
            # Create an instance of DataAnalyzer and generate the report
            # analyzer = DataAnalyzer(file_path)
            # analyzer.create_report()
            
            FileOutput.objects.create(
                review_file=review_file,
                review_text=output['review_text'],
                sentiment_summary=output['sentiment_summary'],
            )

            time.sleep(5)  # Simulate some processing delay
            response_data = {
                'message': 'Data classified successfully!',
                'classified_data': output,  # Include your classified data here
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Data not provided'}, status=status.HTTP_400_BAD_REQUEST)