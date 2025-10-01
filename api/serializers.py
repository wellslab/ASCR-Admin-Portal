from rest_framework import serializers
from .models import Article, CellLineTemplate, TranscribedArticle

class ArticleSerializer(serializers.ModelSerializer):
    """
    Serializer for Article model with curation fields.
    """
    approximate_tokens = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'filename', 'pubmed_id', 'created_on', 'modified_on',
            'curation_status', 'curation_error', 'curation_started_at',
            'transcription_status', 'is_curated', 'approximate_tokens'
        ]
        read_only_fields = ['id', 'created_on', 'modified_on']
    
    def get_approximate_tokens(self, obj):
        """
        Calculate approximate token count for transcription content.
        """
        if obj.transcription_content:
            return len(obj.transcription_content.split()) // 0.75  # Rough estimate
        return 0

class CellLineTemplateSerializer(serializers.ModelSerializer):
    """
    Serializer for CellLineTemplate model with curation source.
    """
    class Meta:
        model = CellLineTemplate
        fields = '__all__'
        read_only_fields = ['created_on', 'modified_on'] 

class TranscribedArticleSerializer(serializers.ModelSerializer):
    """Serializer for TranscribedArticle model"""
    
    class Meta:
        model = TranscribedArticle
        fields = '__all__'
        read_only_fields = ['created_on', 'modified_on']
    
    def to_representation(self, instance):
        """Custom representation to include approximate token count"""
        data = super().to_representation(instance)
        
        # Add approximate token count for transcription content
        if instance.transcription_content:
            data['approximate_tokens'] = len(instance.transcription_content.split()) // 0.75  # Rough estimate
        
        return data 