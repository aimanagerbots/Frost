from fastapi import APIRouter, Depends, HTTPException
from app.database import get_supabase_client, get_supabase_admin
from app.auth.dependencies import get_current_user
from app.auth.dependencies import require_role
from app.auth.schemas import (
    SignUpRequest,
    LoginRequest,
    ProfileResponse,
    ProfileUpdate,
    AuthResponse,
    UserCreateRequest,
    UserUpdateRequest,
)

router = APIRouter()


@router.post("/signup", response_model=AuthResponse)
async def signup(body: SignUpRequest):
    supabase = get_supabase_client()
    try:
        auth_response = supabase.auth.sign_up(
            {
                "email": body.email,
                "password": body.password,
                "options": {
                    "data": {
                        "full_name": body.full_name,
                    }
                },
            }
        )

        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Signup failed")

        # Update profile with role if not default
        if body.role != "viewer":
            admin = get_supabase_admin()
            admin.table("profiles").update({"role": body.role}).eq(
                "id", auth_response.user.id
            ).execute()

        # Fetch created profile
        profile = (
            supabase.table("profiles")
            .select("*")
            .eq("id", auth_response.user.id)
            .single()
            .execute()
        )

        return AuthResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            user=ProfileResponse(**profile.data),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=AuthResponse)
async def login(body: LoginRequest):
    supabase = get_supabase_client()
    try:
        auth_response = supabase.auth.sign_in_with_password(
            {"email": body.email, "password": body.password}
        )

        if not auth_response.user:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        profile = (
            supabase.table("profiles")
            .select("*")
            .eq("id", auth_response.user.id)
            .single()
            .execute()
        )

        return AuthResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            user=ProfileResponse(**profile.data),
        )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@router.post("/logout")
async def logout(user=Depends(get_current_user)):
    supabase = get_supabase_client()
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out"}
    except Exception:
        return {"message": "Logged out"}


@router.get("/me", response_model=ProfileResponse)
async def get_me(user=Depends(get_current_user)):
    return ProfileResponse(**user)


@router.patch("/me", response_model=ProfileResponse)
async def update_me(body: ProfileUpdate, user=Depends(get_current_user)):
    supabase = get_supabase_client()
    update_data = body.model_dump(exclude_none=True)

    if not update_data:
        return ProfileResponse(**user)

    result = (
        supabase.table("profiles")
        .update(update_data)
        .eq("id", user["id"])
        .single()
        .execute()
    )

    return ProfileResponse(**result.data)


@router.get("/users", response_model=list[ProfileResponse])
async def list_users(user=Depends(get_current_user)):
    if user["role"] not in ("admin", "manager"):
        raise HTTPException(status_code=403, detail="Admin or manager role required")

    supabase = get_supabase_client()
    result = (
        supabase.table("profiles")
        .select("*")
        .eq("is_active", True)
        .order("full_name")
        .execute()
    )

    return [ProfileResponse(**row) for row in result.data]


@router.post("/users/create", response_model=ProfileResponse)
async def create_user(body: UserCreateRequest, user=require_role("admin")):
    """Admin-only: create a new user via Supabase Admin API."""
    admin_client = get_supabase_admin()

    try:
        # Create auth user via admin API
        auth_response = admin_client.auth.admin.create_user(
            {
                "email": body.email,
                "password": body.password,
                "email_confirm": True,
                "user_metadata": {"full_name": body.full_name},
            }
        )

        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Failed to create user")

        # Update profile with role, department, title
        update_data = {"role": body.role}
        if body.department:
            update_data["department"] = body.department
        if body.title:
            update_data["title"] = body.title

        admin_client.table("profiles").update(update_data).eq(
            "id", auth_response.user.id
        ).execute()

        # Fetch final profile
        profile = (
            admin_client.table("profiles")
            .select("*")
            .eq("id", auth_response.user.id)
            .single()
            .execute()
        )

        return ProfileResponse(**profile.data)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.patch("/users/{user_id}", response_model=ProfileResponse)
async def update_user(user_id: str, body: UserUpdateRequest, user=require_role("admin")):
    """Admin-only: update another user's profile (role, department, active status)."""
    admin_client = get_supabase_admin()

    update_data = body.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    try:
        result = (
            admin_client.table("profiles")
            .update(update_data)
            .eq("id", user_id)
            .single()
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")

        return ProfileResponse(**result.data)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/users/{user_id}")
async def deactivate_user(user_id: str, user=require_role("admin")):
    """Admin-only: soft-delete a user by setting is_active=false."""
    if user_id == user["id"]:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")

    admin_client = get_supabase_admin()

    try:
        result = (
            admin_client.table("profiles")
            .update({"is_active": False})
            .eq("id", user_id)
            .single()
            .execute()
        )

        if not result.data:
            raise HTTPException(status_code=404, detail="User not found")

        return {"message": "User deactivated", "user_id": user_id}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
