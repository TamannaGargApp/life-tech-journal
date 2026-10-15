from functools import lru_cache
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=["../.env", ".env"],
        env_file_encoding="utf-8-sig",  # also reads .env files Windows saved with a BOM
        extra="ignore",
        # An empty variable (e.g. ADMIN_EMAIL= from docker-compose) must not hide the value in .env
        env_ignore_empty=True,
    )

    APP_NAME: str = "Life & Tech Journal"
    ENV: str = "development"
    SECRET_KEY: str = "changeme"

    # Store as str, parse in validator — works with BOTH formats:
    # ALLOWED_HOSTS=* or ALLOWED_HOSTS=["a","b"] or ALLOWED_HOSTS=a,b
    ALLOWED_HOSTS: str = "*"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB: str = "life_tech_journal"

    REDIS_URL: str = "redis://localhost:6379"
    REDIS_PASSWORD: str = ""
    CACHE_TTL: int = 300

    JWT_SECRET: str = "changeme-jwt"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "ap-south-1"
    AWS_S3_BUCKET: str = ""
    AWS_CLOUDFRONT_DOMAIN: str = ""
    AWS_PRESIGN_EXPIRY: int = 300

    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "noreply@lifetechjournal.com"

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    # Ollama (local AI). Declared here so values from .env / docker-compose are actually used.
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.2"
    OLLAMA_FAST_MODEL: str = "llama3.2"
    OLLAMA_EMBED_MODEL: str = "nomic-embed-text"

    # Admin account. On startup the backend creates this user (or promotes it to admin)
    # and keeps its password in sync with ADMIN_PASSWORD. Leave empty to skip.
    ADMIN_EMAIL: str = ""
    ADMIN_PASSWORD: str = ""
    ADMIN_NAME: str = "Tamanna Garg"

    DEFAULT_PAGE_SIZE: int = 10
    MAX_PAGE_SIZE: int = 50

    def _parse_list(self, value: str) -> List[str]:
        """Parse comma-separated or JSON array string into a list."""
        v = value.strip()
        if not v:
            return []
        # Handle JSON array format: ["a","b"]
        if v.startswith("["):
            import json
            try:
                return [s.strip() for s in json.loads(v)]
            except Exception:
                pass
        # Handle comma-separated: a,b,c
        return [s.strip() for s in v.split(",") if s.strip()]

    @property
    def cors_origins_list(self) -> List[str]:
        return self._parse_list(self.CORS_ORIGINS)

    @property
    def allowed_hosts_list(self) -> List[str]:
        return self._parse_list(self.ALLOWED_HOSTS)


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()