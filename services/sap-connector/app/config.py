from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    port: int = 8000
    connector_secret: str = "dev_secret"
    redis_url: str = "redis://localhost:6379"

    # Fallback SAP credentials (per-tenant credentials come in request headers)
    sap_base_url: str = ""
    sap_username: str = ""
    sap_password: str = ""
    sap_client: str = "100"


settings = Settings()
