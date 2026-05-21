from django.db import models


class Document(models.Model):
    TYPE_PROPOSAL = 'proposal'
    TYPE_FINAL_REPORT = 'final_report'
    TYPE_CHOICES = (
        (TYPE_PROPOSAL, 'Proposal'),
        (TYPE_FINAL_REPORT, 'Laporan Akhir'),
    )

    STATUS_DRAFT = 'draft'
    STATUS_UPLOADED = 'uploaded'
    STATUS_VERIFIED = 'verified'
    STATUS_REJECTED = 'rejected'
    STATUS_CHOICES = (
        (STATUS_DRAFT, 'Draft'),
        (STATUS_UPLOADED, 'Terunggah'),
        (STATUS_VERIFIED, 'Terverifikasi'),
        (STATUS_REJECTED, 'Ditolak'),
    )

    bimbingan_aktif_id = models.IntegerField()
    uploaded_by = models.IntegerField()
    document_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    file_name = models.CharField(max_length=255)
    file_url = models.CharField(max_length=500)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    rejection_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Document(id={self.id}, type={self.document_type}, status={self.status})'
