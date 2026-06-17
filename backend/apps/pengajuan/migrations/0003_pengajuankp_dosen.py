from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
        ('pengajuan', '0002_alter_pengajuankp_catatan_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='pengajuankp',
            name='dosen',
            field=models.ForeignKey(
                blank=True,
                limit_choices_to={'role': 'dosen'},
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='pengajuan_assigned',
                to='authentication.users',
            ),
        ),
        migrations.AlterField(
            model_name='pengajuankp',
            name='status_pengajuan',
            field=models.CharField(default='submitted', max_length=25),
        ),
    ]
