from django.db import models


class Notification(models.Model):
    user_id = models.IntegerField()
    notification_type = models.CharField(max_length=64)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Notification(user_id={self.user_id}, type={self.notification_type})'
