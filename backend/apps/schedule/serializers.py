from rest_framework import serializers


class AvailabilityCheckQuerySerializer(serializers.Serializer):
    lecturer_id = serializers.IntegerField()
    date = serializers.DateField()
    time = serializers.TimeField(required=False)


class AvailableSlotsQuerySerializer(serializers.Serializer):
    lecturer_id = serializers.IntegerField()
    date = serializers.DateField()
