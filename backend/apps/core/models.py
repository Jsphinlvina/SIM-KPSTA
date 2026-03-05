from django.db import models


# Create your models here.
class Topic(models.Model):
    TYPE_CHOICES = [
        ("KP", "Kerja Praktik"),
        ("TA", "Tugas Akhir"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    topic_type = models.CharField(max_length=2, choices=TYPE_CHOICES)
    quota = models.IntegerField(default=1)

    def __str__(self):
        return self.title
