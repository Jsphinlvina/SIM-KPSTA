from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0003_users_must_change_password'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='users',
            name='is_staff',
        ),
    ]
