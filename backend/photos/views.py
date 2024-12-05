from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.viewsets import ModelViewSet
from .models import Album, Image, Metadata
from .serializers import AlbumSerializer, ImageSerializer, MetadataSerializer
import os
from django.conf import settings

class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer

    def destroy(self, request, *args, **kwargs):
        album = self.get_object()
        delete_images = self.request.query_params.get('delete_images', 'false').lower() == 'true'

        print(f"Deleting album: {album.name} (ID: {album.id})")
        if delete_images:
            for image in album.images.all():
                image_path = os.path.join(settings.MEDIA_ROOT, str(image.file))
                print(f"Attempting to delete image file: {image_path}")
                if os.path.exists(image_path):
                    try:
                        os.remove(image_path)
                        print(f"Deleted file: {image_path}")
                    except Exception as e:
                        print(f"Error deleting file {image_path}: {e}")
                else:
                    print(f"File not found: {image_path}")
                image.delete()
                print(f"Deleted image object from database: {image}")

        # Proceed with deleting the album
        response = super().destroy(request, *args, **kwargs)
        print(f"Deleted album: {album.name} (ID: {album.id})")
        return response



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
        image = self.get_object()

        # Delete the file from the media folder
        image_path = os.path.join(settings.MEDIA_ROOT, str(image.file))
        try:
            if os.path.exists(image_path):
                os.remove(image_path)
        except Exception as e:
            print(f"Error deleting file {image_path}: {e}")

        # Proceed with deleting the image object
        return super().destroy(request, *args, **kwargs)


class MetadataViewSet(viewsets.ModelViewSet):
    queryset = Metadata.objects.all()
    serializer_class = MetadataSerializer

    def destroy(self, request, *args, **kwargs):
        metadata = self.get_object()
        # You can add additional logic here if needed
        return super().destroy(request, *args, **kwargs)
