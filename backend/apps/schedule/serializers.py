from rest_framework import serializers

from .models import ScheduleEvent


class AvailabilityCheckQuerySerializer(serializers.Serializer):
    lecturer_id = serializers.IntegerField()
    date = serializers.DateField()
    time = serializers.TimeField(required=False)


class AvailableSlotsQuerySerializer(serializers.Serializer):
    lecturer_id = serializers.IntegerField()
    date = serializers.DateField()


class ScheduleEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleEvent
        fields = [
            'id', 'bimbingan_aktif_id', 'lecturer_id', 'event_type',
            'date', 'time', 'location', 'notes', 'status',
            'created_at', 'updated_at',
        ]
        read_only_fields = fields


class GuidanceCreateSerializer(serializers.Serializer):
    bimbingan_aktif_id = serializers.IntegerField()
    lecturer_id = serializers.IntegerField()
    date = serializers.DateField()
    time = serializers.TimeField()
    location = serializers.CharField(required=False, allow_blank=True, max_length=255)
    notes = serializers.CharField(required=False, allow_blank=True)


class GuidanceUpdateSerializer(serializers.Serializer):
    location = serializers.CharField(required=False, allow_blank=True, max_length=255)
    notes = serializers.CharField(required=False, allow_blank=True)


class RescheduleSerializer(serializers.Serializer):
    date = serializers.DateField()
    time = serializers.TimeField()
