from rest_framework import serializers

from .models import ArchiveRecord


class ArchiveRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArchiveRecord
        fields = [
            'id', 'source_type', 'source_id', 'title',
            'student_id', 'lecturer_id', 'state',
            'created_at', 'updated_at',
        ]
        read_only_fields = fields


class ArchiveRecordCreateSerializer(serializers.Serializer):
    source_type = serializers.ChoiceField(
        choices=[ArchiveRecord.SOURCE_DOCUMENT, ArchiveRecord.SOURCE_SCHEDULE],
    )
    source_id = serializers.IntegerField()
    title = serializers.CharField(max_length=255)
    student_id = serializers.IntegerField(required=False)
    lecturer_id = serializers.IntegerField(required=False)
