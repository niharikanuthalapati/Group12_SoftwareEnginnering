from rest_framework import viewsets
from .models import CustomUser, Product, Review, Feedback, Report, ReviewFeedback, InterfaceFeedback
from .serializers import CustomUserSerializer, ProductSerializer, ReviewSerializer, FeedbackSerializer, ReportSerializer, ReviewFeedbackSerializer, InterfaceFeedbackSerializer
from django.contrib.auth import get_user_model, authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.parsers import JSONParser
from django.http import JsonResponse
from rest_framework import status

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
        serializer = ReviewFeedbackSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Feedback submitted successfully!'}, status=201)
        return JsonResponse(serializer.errors, status=400)

@api_view(['POST'])
def interface_feedback(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = InterfaceFeedbackSerializer(data=data)

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

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
