from django.db import models

class Album(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Image(models.Model):
    file = models.ImageField(upload_to='images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    album = models.ForeignKey(
        'Album',
        on_delete=models.SET_NULL,  # Set the album to NULL instead of deleting the image
        null=True,
        blank=True,
        related_name='images'
    )

    def __str__(self):
        return self.file.name


class Metadata(models.Model):
    image = models.OneToOneField(Image, on_delete=models.CASCADE, related_name='metadata')
    people = models.TextField(blank=True, null=True)  # Could store names as a comma-separated string
    location = models.CharField(max_length=255, blank=True, null=True)
    date_taken = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Metadata for {self.image.file.name}"
