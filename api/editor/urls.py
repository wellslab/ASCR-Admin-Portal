from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'celllines', views.CellLineTemplateViewSet)

urlpatterns = [
    # Schema introspection endpoint
    path('cellline-schema/', views.cellline_schema, name='cellline-schema'),
    
    # Include router URLs for CRUD operations
    path('', include(router.urls)),
]
