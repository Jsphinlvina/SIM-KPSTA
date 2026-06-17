from rest_framework import serializers


class ReportSerializer(serializers.Serializer):
    title = serializers.CharField()
    periode = serializers.CharField()
    report_type = serializers.CharField()
    data = serializers.DictField()
