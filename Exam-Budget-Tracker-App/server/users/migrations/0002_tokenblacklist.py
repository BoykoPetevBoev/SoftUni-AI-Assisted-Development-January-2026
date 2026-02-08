# Generated migration for TokenBlacklist model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TokenBlacklist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.TextField()),
                ('blacklisted_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'token_blacklist',
            },
        ),
        migrations.AddIndex(
            model_name='tokenblacklist',
            index=models.Index(fields=['token'], name='token_blacklist_token_idx'),
        ),
    ]
