import os


class AppConfigValues:
    RABBIT_HOST = os.getenv("RABBIT_HOST", "localhost")
    RABBIT_PORT = os.getenv("RABBIT_PORT", "5672")
    RABBIT_USER = os.getenv("RABBIT_USER", "user")
    RABBIT_PASSWORD = os.getenv("RABBIT_PASSWORD", "secret")
