from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_alter_users_groups_alter_users_user_permissions'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='must_change_password',
            field=models.BooleanField(default=False),
        ),
    ]
