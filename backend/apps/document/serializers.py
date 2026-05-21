from rest_framework import serializers

from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            'id', 'bimbingan_aktif_id', 'uploaded_by', 'document_type',
            'file_name', 'file_url', 'status', 'rejection_reason',
            'created_at', 'updated_at',
        ]
        read_only_fields = fields


class DocumentUploadSerializer(serializers.Serializer):
    bimbingan_aktif_id = serializers.IntegerField()
    uploaded_by = serializers.IntegerField()
    file = serializers.FileField()


class DocumentRejectSerializer(serializers.Serializer):
    reason = serializers.CharField()
