from rest_framework.routers import DefaultRouter
from .views import TranscriptionRecordViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r'', TranscriptionRecordViewSet, basename='transcription')

urlpatterns = [
    path('', include(router.urls)),
    path('create_article/', TranscriptionRecordViewSet.as_view({'post': 'create_article'}), name='create_article'),
]