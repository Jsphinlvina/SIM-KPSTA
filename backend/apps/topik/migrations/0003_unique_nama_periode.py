from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('topik', '0002_alter_periode_status_boolean'),
    ]

    operations = [
        migrations.AlterField(
            model_name='periodesemester',
            name='nama_periode',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]
