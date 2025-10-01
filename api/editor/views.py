from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from api.models import CellLineTemplate
from .serializers import CellLineTemplateSerializer, pydantic_to_json_schema
import logging

logger = logging.getLogger(__name__)


class CellLinePagination(PageNumberPagination):
    """
    Custom pagination for infinite scrolling support.
    Optimized for frontend infinite scroll implementation.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'page_size': self.page_size,
            'results': data
        })


@api_view(['GET'])
def cellline_schema(request):
    """
    Schema introspection endpoint that provides complete field metadata
    for the CellLineTemplate model to enable dynamic frontend form generation.
    
    Returns:
    - Field types and validation rules
    - Choice field options
    - JSON schema for complex fields
    - Default values and help text
    """
    try:
        schema = pydantic_to_json_schema()
        
        logger.info(f"Schema introspection successful. Total fields: {schema.get('total_fields', 0)}")
        
        return Response({
            'success': True,
            'schema': schema,
            'meta': {
                'generated_at': '2025-01-02T00:00:00Z',
                'model_version': '1.0',
                'supports_infinite_scroll': True,
                'supports_locking': True
            }
        })
        
    except Exception as e:
        logger.error(f"Schema introspection failed: {str(e)}")
        return Response({
            'success': False,
            'error': 'Failed to generate schema',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CellLineTemplateViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CellLineTemplate CRUD operations.
    
    Features:
    - Full CRUD operations with validation
    - Infinite scroll pagination
    - Search and filtering capabilities
    - Locking mechanism for concurrent editing
    - Comprehensive error handling
    
    TODO: Add authentication and permissions in later sprint
    """
    queryset = CellLineTemplate.objects.all().order_by('CellLine_hpscreg_id')
    serializer_class = CellLineTemplateSerializer
    lookup_field = 'CellLine_hpscreg_id'
    pagination_class = CellLinePagination
    
    def get_queryset(self):
        """
        Optionally filter the queryset based on search parameters.
        Supports searching across multiple fields for infinite scroll.
        """
        queryset = CellLineTemplate.objects.all()
        
        # Search functionality
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(CellLine_hpscreg_id__icontains=search) |
                Q(CellLine_cell_line_type__icontains=search) |
                Q(CellLine_source_cell_type__icontains=search) |
                Q(CellLine_contact_name__icontains=search) |
                Q(CellLine_maintainer__icontains=search)
            )
        
        # Filter by cell line type
        cell_type = self.request.query_params.get('cell_type', None)
        if cell_type:
            queryset = queryset.filter(CellLine_cell_line_type=cell_type)
            
        # Filter by locked status
        locked_status = self.request.query_params.get('locked', None)
        if locked_status is not None:
            is_locked = locked_status.lower() == 'true'
            queryset = queryset.filter(is_locked=is_locked)
        
        # Filter by curation source
        curation_source = self.request.query_params.get('curation_source', None)
        if curation_source:
            queryset = queryset.filter(curation_source=curation_source)
        
        return queryset.order_by('CellLine_hpscreg_id')
    
    def list(self, request, *args, **kwargs):
        """List all cell lines with pagination support for infinite scroll"""
        try:
            queryset = self.filter_queryset(self.get_queryset())
            page = self.paginate_queryset(queryset)
            
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = self.get_serializer(queryset, many=True)
            return Response({
                'success': True,
                'count': queryset.count(),
                'results': serializer.data
            })
            
        except Exception as e:
            logger.error(f"Failed to list cell lines: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to retrieve cell lines',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def retrieve(self, request, *args, **kwargs):
        """Retrieve a single cell line by hpscreg_id"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            
            # Check if lock is expired and clear it
            if instance.is_lock_expired():
                instance.unlock()
                
            return Response({
                'success': True,
                'data': serializer.data,
                'meta': {
                    'is_locked': instance.is_locked,
                    'locked_by': instance.locked_by,
                    'locked_at': instance.locked_at,
                    'lock_expired': instance.is_lock_expired()
                }
            })
            
        except ObjectDoesNotExist:
            return Response({
                'success': False,
                'error': 'Cell line not found',
                'details': f'No cell line found with ID: {kwargs.get(self.lookup_field)}'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Failed to retrieve cell line: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to retrieve cell line',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def create(self, request, *args, **kwargs):
        """Create a new cell line with validation"""
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Save the instance
            instance = serializer.save()
            
            # Auto-lock for initial editing
            user_identifier = request.META.get('HTTP_X_USER_ID', 'anonymous')
            instance.lock_for_editing(user_identifier)
            
            logger.info(f"Created new cell line: {instance.CellLine_hpscreg_id}")
            
            return Response({
                'success': True,
                'data': CellLineTemplateSerializer(instance).data,
                'message': 'Cell line created successfully',
                'meta': {
                    'locked_for_editing': True,
                    'locked_by': user_identifier
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Failed to create cell line: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to create cell line',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, *args, **kwargs):
        """Update an existing cell line with automatic version creation"""
        import time
        start_time = time.time()
        
        try:
            instance = self.get_object()
            
            # Check if locked by another user
            user_identifier = request.META.get('HTTP_X_USER_ID', 'anonymous')
            if instance.is_locked and instance.locked_by != user_identifier:
                if not instance.is_lock_expired():
                    return Response({
                        'success': False,
                        'error': 'Cell line is locked for editing',
                        'details': f'Locked by {instance.locked_by} at {instance.locked_at}'
                    }, status=status.HTTP_423_LOCKED)

            # Create version before updating (complete snapshot)
            version_created = None
            try:
                version_created = instance.create_version(
                    user_identifier=user_identifier,
                    change_summary=''  # Can be enhanced later with change detection
                )
                logger.info(f"Created version {version_created.version_number} for {instance.CellLine_hpscreg_id}")
            except Exception as version_error:
                logger.error(f"Failed to create version: {str(version_error)}")
                # Continue with update even if version creation fails
                # This ensures the user doesn't lose their work

            serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
            serializer.is_valid(raise_exception=True)
            
            # Save and unlock
            updated_instance = serializer.save()
            updated_instance.unlock()
            
            # Calculate performance metrics
            update_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            logger.info(f"Updated cell line: {updated_instance.CellLine_hpscreg_id} (took {update_time:.2f}ms)")
            
            response_data = {
                'success': True,
                'data': serializer.data,
                'message': 'Cell line updated successfully',
                'performance': {
                    'update_time_ms': round(update_time, 2)
                }
            }
            
            # Include version information if created successfully
            if version_created:
                response_data['version_info'] = {
                    'version_number': version_created.version_number,
                    'created_at': version_created.created_on,
                    'total_versions': updated_instance.versions.filter(is_archived=False).count()
                }
            
            return Response(response_data)
            
        except ObjectDoesNotExist:
            return Response({
                'success': False,
                'error': 'Cell line not found',
                'details': f'No cell line found with ID: {kwargs.get(self.lookup_field)}'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Failed to update cell line: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to update cell line',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        """Delete a cell line"""
        try:
            instance = self.get_object()
            
            # Check if locked by another user
            user_identifier = request.META.get('HTTP_X_USER_ID', 'anonymous')
            if instance.is_locked and instance.locked_by != user_identifier:
                if not instance.is_lock_expired():
                    return Response({
                        'success': False,
                        'error': 'Cell line is locked for editing',
                        'details': f'Cannot delete. Locked by {instance.locked_by}'
                    }, status=status.HTTP_423_LOCKED)
            
            hpscreg_id = instance.CellLine_hpscreg_id
            instance.delete()
            
            logger.info(f"Deleted cell line: {hpscreg_id}")
            
            return Response({
                'success': True,
                'message': f'Cell line {hpscreg_id} deleted successfully'
            }, status=status.HTTP_204_NO_CONTENT)
            
        except ObjectDoesNotExist:
            return Response({
                'success': False,
                'error': 'Cell line not found',
                'details': f'No cell line found with ID: {kwargs.get(self.lookup_field)}'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Failed to delete cell line: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to delete cell line',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def new_template(self, request):
        """
        Return a blank template for creating new cell lines.
        Includes default values and field structure.
        """
        try:
            # Create template with default values
            template_data = {}
            from django.db.models.fields import NOT_PROVIDED
            
            for field in CellLineTemplate._meta.get_fields():
                if hasattr(field, 'default') and field.default is not None and field.default != NOT_PROVIDED:
                    if callable(field.default):
                        try:
                            template_data[field.name] = field.default()
                        except:
                            template_data[field.name] = None
                    else:
                        template_data[field.name] = field.default
                elif field.__class__.__name__ == 'JSONField':
                    template_data[field.name] = []
                elif not field.primary_key and field.name not in ['created_on', 'modified_on', 'is_locked', 'locked_by', 'locked_at']:
                    template_data[field.name] = None
            
            return Response({
                'success': True,
                'template': template_data,
                'meta': {
                    'total_fields': len(template_data),
                    'required_fields': [
                        'CellLine_hpscreg_id',
                        'CellLine_cell_line_type',
                        'CellLine_source_cell_type',
                        'CellLine_source_tissue',
                        'CellLine_source'
                    ]
                }
            })
            
        except Exception as e:
            logger.error(f"Failed to generate new template: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to generate template',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def lock(self, request, CellLine_hpscreg_id=None):
        """Lock a cell line for editing"""
        try:
            instance = self.get_object()
            user_identifier = request.META.get('HTTP_X_USER_ID', 'anonymous')
            
            if instance.is_locked and instance.locked_by != user_identifier:
                if not instance.is_lock_expired():
                    return Response({
                        'success': False,
                        'error': 'Cell line already locked',
                        'details': f'Locked by {instance.locked_by} at {instance.locked_at}'
                    }, status=status.HTTP_423_LOCKED)
            
            instance.lock_for_editing(user_identifier)
            
            return Response({
                'success': True,
                'message': 'Cell line locked for editing',
                'locked_by': user_identifier,
                'locked_at': instance.locked_at
            })
            
        except Exception as e:
            logger.error(f"Failed to lock cell line: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to lock cell line',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def unlock(self, request, CellLine_hpscreg_id=None):
        """Unlock a cell line after editing"""
        try:
            instance = self.get_object()
            user_identifier = request.META.get('HTTP_X_USER_ID', 'anonymous')
            
            if instance.is_locked and instance.locked_by != user_identifier:
                return Response({
                    'success': False,
                    'error': 'Cannot unlock cell line',
                    'details': f'Locked by different user: {instance.locked_by}'
                }, status=status.HTTP_403_FORBIDDEN)
            
            instance.unlock()
            
            return Response({
                'success': True,
                'message': 'Cell line unlocked successfully'
            })
            
        except Exception as e:
            logger.error(f"Failed to unlock cell line: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to unlock cell line',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], url_path='versions')
    def version_history(self, request, CellLine_hpscreg_id=None):
        """Get version history for a cell line"""
        import time
        start_time = time.time()
        
        try:
            instance = self.get_object()
            
            # Get version history (last 10 active versions)
            versions = instance.get_version_history(limit=10)
            
            from .serializers import CellLineVersionSerializer
            serializer = CellLineVersionSerializer(versions, many=True)
            
            # Get total and archived counts
            total_versions = instance.versions.count()
            archived_count = instance.versions.filter(is_archived=True).count()
            
            retrieval_time = (time.time() - start_time) * 1000
            
            return Response({
                'success': True,
                'versions': serializer.data,
                'total_versions': total_versions,
                'archived_count': archived_count,
                'performance': {
                    'retrieval_time_ms': round(retrieval_time, 2)
                }
            })
            
        except ObjectDoesNotExist:
            return Response({
                'success': False,
                'error': 'Cell line not found',
                'details': f'No cell line found with ID: {CellLine_hpscreg_id}'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Failed to retrieve version history: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to retrieve version history',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'], url_path='versions/(?P<version_number>[0-9]+)')
    def version_detail(self, request, CellLine_hpscreg_id=None, version_number=None):
        """Get specific version data for a cell line"""
        import time
        start_time = time.time()
        
        try:
            instance = self.get_object()
            
            # Get specific version
            version = instance.versions.filter(
                version_number=version_number,
                is_archived=False
            ).first()
            
            if not version:
                return Response({
                    'success': False,
                    'error': 'Version not found',
                    'details': f'Version {version_number} not found for cell line {CellLine_hpscreg_id}'
                }, status=status.HTTP_404_NOT_FOUND)
            
            from .serializers import CellLineVersionDetailSerializer
            serializer = CellLineVersionDetailSerializer(version)
            
            retrieval_time = (time.time() - start_time) * 1000
            
            response_data = serializer.data
            response_data['performance'] = {
                'retrieval_time_ms': round(retrieval_time, 2)
            }
            
            return Response({
                'success': True,
                **response_data
            })
            
        except ObjectDoesNotExist:
            return Response({
                'success': False,
                'error': 'Cell line not found',
                'details': f'No cell line found with ID: {CellLine_hpscreg_id}'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Failed to retrieve version detail: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to retrieve version detail',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
