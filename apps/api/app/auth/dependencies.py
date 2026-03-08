from fastapi import Depends, HTTPException, Header
from app.database import get_supabase_client


async def get_current_user(authorization: str = Header(...)):
    """Validate JWT from Authorization header and return user profile."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.removeprefix("Bearer ")
    supabase = get_supabase_client()

    try:
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        user = user_response.user

        # Fetch profile from public.profiles
        profile = (
            supabase.table("profiles")
            .select("*")
            .eq("id", user.id)
            .single()
            .execute()
        )

        if not profile.data:
            raise HTTPException(status_code=404, detail="Profile not found")

        return profile.data

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Authentication failed")


async def require_role(*roles: str):
    """Factory for role-based access control."""

    async def dependency(user=Depends(get_current_user)):
        if user["role"] not in roles:
            raise HTTPException(
                status_code=403,
                detail=f"Requires one of: {', '.join(roles)}",
            )
        return user

    return dependency
