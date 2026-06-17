from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
        ('pengajuan', '0003_pengajuankp_dosen'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pengajuankp',
            name='dosen',
        ),
    ]
