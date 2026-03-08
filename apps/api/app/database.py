from supabase import create_client, Client
from app.config import settings


def get_supabase_client() -> Client:
    """Public client — respects RLS policies."""
    return create_client(settings.supabase_url, settings.supabase_anon_key)


def get_supabase_admin() -> Client:
    """Admin client — bypasses RLS. Use for service-level operations only."""
    return create_client(settings.supabase_url, settings.supabase_service_role_key)
