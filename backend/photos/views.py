from rest_framework import viewsets
from .models import Album, Image, Metadata
from .serializers import AlbumSerializer, ImageSerializer, MetadataSerializer

# ViewSet for Albums
class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

# ViewSet for Images
class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

# ViewSet for Metadata
class MetadataViewSet(viewsets.ModelViewSet):
    queryset = Metadata.objects.all()
    serializer_class = MetadataSerializer
