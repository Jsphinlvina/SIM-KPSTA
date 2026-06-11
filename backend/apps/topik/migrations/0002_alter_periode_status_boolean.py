from django.db import migrations, models


def str_to_bool(apps, schema_editor):
    PeriodeSemester = apps.get_model('topik', 'PeriodeSemester')
    for p in PeriodeSemester.objects.all():
        p.status_bool = p.status_periode == 'aktif'
        p.save()


def bool_to_str(apps, schema_editor):
    PeriodeSemester = apps.get_model('topik', 'PeriodeSemester')
    for p in PeriodeSemester.objects.all():
        p.status_periode = 'aktif' if p.status_bool else 'nonaktif'
        p.save()


class Migration(migrations.Migration):

    dependencies = [
        ('topik', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='periodesemester',
            name='status_bool',
            field=models.BooleanField(default=False),
        ),
        migrations.RunPython(str_to_bool, bool_to_str),
        migrations.RemoveField(
            model_name='periodesemester',
            name='status_periode',
        ),
        migrations.RenameField(
            model_name='periodesemester',
            old_name='status_bool',
            new_name='status_periode',
        ),
    ]
