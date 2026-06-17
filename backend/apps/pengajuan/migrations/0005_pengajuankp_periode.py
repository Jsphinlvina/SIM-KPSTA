from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pengajuan', '0004_remove_pengajuankp_dosen'),
        ('topik', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pengajuankp',
            name='periode',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to='topik.periodesemester',
            ),
        ),
    ]
