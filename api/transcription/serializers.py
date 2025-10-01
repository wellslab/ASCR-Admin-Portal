from rest_framework import serializers
from .models import TranscriptionRecord

class TranscriptionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranscriptionRecord
        fields = '__all__'
