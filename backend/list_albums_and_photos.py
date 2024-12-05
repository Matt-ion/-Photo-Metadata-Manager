import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from photos.models import Album, Image

def list_albums_and_photos():
    print("Albums and their Photos:\n")
    albums = Album.objects.all()
    if albums.exists():
        for album in albums:
            print(f"Album: {album.name}")
            photos = album.images.all()
            if photos.exists():
                for photo in photos:
                    print(f"  - Photo: {photo.file} (Uploaded at: {photo.uploaded_at})")
            else:
                print("  - No photos in this album.")
            print()
    else:
        print("No albums found.\n")

    print("Other Photos (Not Assigned to Any Album):\n")
    other_photos = Image.objects.filter(album__isnull=True)
    if other_photos.exists():
        for photo in other_photos:
            print(f"Photo: {photo.file} (Uploaded at: {photo.uploaded_at})")
    else:
        print("No other photos found.\n")


if __name__ == "__main__":
    list_albums_and_photos()
