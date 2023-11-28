import os
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.conf import settings
from rest_framework import status
from rest_framework.parsers import JSONParser
from django.contrib.auth import get_user_model, authenticate
from django.http import JsonResponse
from .models import (
    FileOutput, 
    ReportGenerated, 
    ReviewFeedback, 
    ReviewFile, 
    UserInterfaceFeedback
)
from .serializers import (
    CustomUserSerializer, 
    ReviewFeedbackSerializer, 
    ReviewFileSerializer, 
    UserInterfaceFeedbackSerializer
)
from reviews.data_analyzer import DataAnalyzer
from reviews.ReportGenerator import ReportGenerator
dataAnalyzer = DataAnalyzer()

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


@api_view(['GET'])
@permission_classes([AllowAny])
def generate_report_data(request):
    review_file_id = request.query_params.get('review_file_id')
    colorOptions = request.query_params.getlist('colorOptions[]')
    if not review_file_id:
        return Response({'error': 'Please submit data file first.'}, status=400)

    try:
        review_file = ReviewFile.objects.get(id=review_file_id)
        file_output = FileOutput.objects.get(review_file__id=review_file_id)
        ui_feedbacks = UserInterfaceFeedback.objects.filter(review_file__id=review_file_id)
        review_feedbacks = ReviewFeedback.objects.filter(review_file__id=review_file_id)

        # Instantiate ReportGenerator and generate reports
        report_generator = ReportGenerator(file_output, ui_feedbacks, review_feedbacks, colorOptions)
        pdf_path = report_generator.generate_pdf_report()
        ReportGenerated.objects.create(
            review_file=review_file,
            file_path = pdf_path
        )

        docx_path = report_generator.generate_docx_report()
        ReportGenerated.objects.create(
            review_file=review_file,
            file_path = docx_path
        )

        # Construct response with file paths
        response_data = {
            'pdf_path': default_storage.url(pdf_path),
            'docx_path': default_storage.url(docx_path),
        }

        return Response(response_data)

    except FileOutput.DoesNotExist:
        return Response({'error': 'File not found for the provided id.'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

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

            file_path = os.path.join(settings.MEDIA_ROOT, 'uploads', os.path.basename(data['file']))
            file_path = file_path.replace('\\', '/')
            # Create an instance of DataAnalyzer and generate the report
            output = dataAnalyzer.analyze(file_path)
            FileOutput.objects.create(
                review_file=review_file,
                review_text=output['review_text'],
                sentiment_summary=output['sentiment_summary'],
            )
            response_data = {
                'message': 'Data classified successfully!',
                'classified_data': output,  # Include your classified data here
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Data not provided'}, status=status.HTTP_400_BAD_REQUEST)