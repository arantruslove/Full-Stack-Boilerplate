import os
import boto3
import json


def load_aws_secrets(secret_name, region_name="eu-west-2"):
    """Fetches the AWS secrets file contents."""

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(service_name="secretsmanager", region_name=region_name)

    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except Exception as e:
        # Handle the exception according to your needs
        raise e

    secret = get_secret_value_response["SecretString"]
    return json.loads(secret)


def get_config():
    """Fetches either AWS secrets (production) or environment variables (development)
    sets them as the config dictionary."""

    # List of configuration keys you expect in both AWS secrets and environment variables
    config_keys = [
        "DEBUG",
        "SECRET_KEY",
        "TRUSTED_ORIGINS",
        "ALLOWED_HOSTS",
        "EMAIL_HOST",
        "EMAIL_HOST_USER",
        "EMAIL_BACKEND",
        "EMAIL_HOST_PASSWORD",
        "DB_NAME",
        "DB_USER",
        "DB_PASSWORD",
        "DB_HOST",
        "DB_PORT",
    ]

    config = {}
    if os.getenv("DJANGO_ENV") == "production":
        aws_secrets = load_aws_secrets(os.getenv("AWS_SECRET"))

        for key in config_keys:
            config[key] = aws_secrets.get(key, None)

    else:
        # Load from environment variables
        for key in config_keys:
            config[key] = os.environ.get(key, None)

    return config


config = get_config()
