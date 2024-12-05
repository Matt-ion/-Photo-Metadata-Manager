from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import Album, Image, Metadata
from .serializers import AlbumSerializer, ImageSerializer, MetadataSerializer


# ViewSet for Albums
class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

    def destroy(self, request, *args, **kwargs):
        album = self.get_object()
        delete_images = self.request.query_params.get('delete_images', 'false').lower() == 'true'

        if delete_images:
            # Delete all images associated with this album
            album.images.all().delete()

        # Proceed with deleting the album
        return super().destroy(request, *args, **kwargs)


# ViewSet for Images
class ImageViewSet(ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        album_id = self.request.query_params.get('album')
        if album_id:
            queryset = queryset.filter(album_id=album_id)
        return queryset

    def destroy(self, request, *args, **kwargs):
        album_id = self.request.query_params.get('album')
        if album_id:
            # Delete all images for the specified album
            images = self.queryset.filter(album_id=album_id)
            images.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        # Delete a single image
        return super().destroy(request, *args, **kwargs)


# ViewSet for Metadata
class MetadataViewSet(viewsets.ModelViewSet):
    queryset = Metadata.objects.all()
    serializer_class = MetadataSerializer

    def destroy(self, request, *args, **kwargs):
        metadata = self.get_object()
        # You can add additional logic here if needed
        return super().destroy(request, *args, **kwargs)
