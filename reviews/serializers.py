from rest_framework import serializers
from .models import CustomUser, Product, Review, Feedback, Report, ReviewFeedback, InterfaceFeedback
from django.contrib.auth import get_user_model


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('first_name', 'last_name', 'email', 'dob', 'password')
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            dob=validated_data['dob']
        )
        return user


class ReviewFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewFeedback
        fields = ['email', 'starRating', 'comment']

class InterfaceFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterfaceFeedback
        fields = ['email', 'comment']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

