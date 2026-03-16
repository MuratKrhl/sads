from decouple import config
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config("DJANGO_SECRET_KEY")
DEBUG      = config("DEBUG", default=False, cast=bool)
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="localhost,127.0.0.1").split(",")

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.auth",
    "rest_framework",
    "corsheaders",
    "channels",
    "django_core.dynatrace",
    "app.websocket",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "django_core.config.urls"

# ── ASGI (Channels) ────────────────────────────────────────────
ASGI_APPLICATION = "django_core.config.asgi.application"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [config("REDIS_URL", default="redis://localhost:6379")],
        },
    }
}

# ── CORS ───────────────────────────────────────────────────────
CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    default="http://localhost:3000,http://localhost:5173",
).split(",")

# ── REDIS CACHE ────────────────────────────────────────────────
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": config("REDIS_URL", default="redis://localhost:6379"),
        "OPTIONS": {
            "parser_class": "redis.connection.HiredisParser",
        },
        "TIMEOUT": 60,  # default 60s, her endpoint override eder
    }
}

# ── DYNATRACE ──────────────────────────────────────────────────
DYNATRACE = {
    "BASE_URL":  config("DT_BASE_URL"),    # https://{env-id}.live.dynatrace.com
    "API_TOKEN": config("DT_API_TOKEN"),   # dt0c01.***
    "TIMEOUT":   config("DT_TIMEOUT", default=10, cast=int),
}

# ── DRF ────────────────────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_THROTTLE_CLASSES":  ["rest_framework.throttling.AnonRateThrottle"],
    "DEFAULT_THROTTLE_RATES":    {"anon": "120/min"},
}

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
