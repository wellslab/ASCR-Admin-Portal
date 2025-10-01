from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

# Create router for ViewSets
router = DefaultRouter()
router.register(r'articles', views.ArticleViewSet, basename='articles')
router.register(r'transcribed-articles', views.TranscribedArticleViewSet, basename='transcribed-articles')

# Transcription service URLs
urlpatterns = [
    path('ping/', views.health_check, name='health_check'),
    path('transcription/', include('api.transcription.urls')),
    path('editor/', include('api.editor.urls')),
    path('curation/', include('api.curation.urls')),
    path('', include(router.urls)),
]