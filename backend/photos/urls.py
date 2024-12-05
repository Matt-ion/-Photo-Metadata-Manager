from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlbumViewSet, ImageViewSet, MetadataViewSet

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'albums', AlbumViewSet, basename='album')
router.register(r'images', ImageViewSet, basename='image')
router.register(r'metadata', MetadataViewSet, basename='metadata')

# Include router URLs
urlpatterns = [
    path('', include(router.urls)),
]
