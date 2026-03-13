from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    database_url: str = ""

    # Frontend URLs for CORS
    app_url: str = "https://frost-orcin.vercel.app"
    website_url: str = "https://frost-website.vercel.app"
    portal_url: str = "https://frost-portal.vercel.app"

    model_config = {"env_file": ".env"}


settings = Settings()
