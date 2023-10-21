from rest_framework import serializers
from .models import CustomUser, ReviewFile, FileOutput, UserInterfaceFeedback, ReviewFeedback, ReportGenerated

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


# class ReviewFeedbackSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ReviewFeedback
#         fields = ['email', 'starRating', 'comment']

# class InterfaceFeedbackSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = InterfaceFeedback
#         fields = ['email', 'comment']

class ReviewFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewFile
        fields = '__all__'

class FileOutputSerializer(serializers.ModelSerializer):
    review_file = ReviewFileSerializer()
    
    class Meta:
        model = FileOutput
        fields = '__all__'

class UserInterfaceFeedbackSerializer(serializers.ModelSerializer):
    review_file = ReviewFileSerializer()

    class Meta:
        model = UserInterfaceFeedback
        fields = ['review_file', 'comment']

class ReviewFeedbackSerializer(serializers.ModelSerializer):
    review_file = ReviewFileSerializer()

    class Meta:
        model = ReviewFeedback
        fields = ['review_file', 'star_rating', 'comment']

class ReportGeneratedSerializer(serializers.ModelSerializer):
    review_file = ReviewFileSerializer()

    class Meta:
        model = ReportGenerated
        fields = '__all__'