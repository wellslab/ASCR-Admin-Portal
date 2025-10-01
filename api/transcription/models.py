from django.db import models

class TranscriptionRecord(models.Model):
    # Fields
    filename = models.CharField(max_length=100)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)
    is_curated = models.BooleanField(default=False)
    transcription_content = models.TextField(blank=True)
