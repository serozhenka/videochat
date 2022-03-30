from django.db import models

class RoomMember(models.Model):
    name = models.CharField(max_length=128)
    uid = models.CharField(max_length=128)
    room_name = models.CharField(max_length=256)

    def __str__(self):
        return self.name

