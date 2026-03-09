from fastapi import APIRouter, Depends, HTTPException
from app.database import get_supabase_client, get_supabase_admin
from app.auth.dependencies import get_current_user, require_role
from app.permissions.schemas import (
    ModuleDefinition,
    ResolvedPermissions,
    RoleModuleDefault,
    SetOverridesRequest,
    SetRoleModulesRequest,
    UserModuleOverride,
    UserPermissionsResponse,
)

router = APIRouter()


def resolve_permissions(role: str, user_id: str, supabase) -> ResolvedPermissions:
    """Resolve final module list: role defaults + per-user overrides."""
    # 1. Get role defaults
    defaults_result = (
        supabase.table("role_module_defaults")
        .select("module_slug")
        .eq("role", role)
        .execute()
    )
    allowed = {row["module_slug"] for row in defaults_result.data}

    # 2. Get user overrides
    overrides_result = (
        supabase.table("user_module_overrides")
        .select("module_slug, granted")
        .eq("user_id", user_id)
        .execute()
    )

    # 3. Apply overrides
    for override in overrides_result.data:
        if override["granted"]:
            allowed.add(override["module_slug"])
        else:
            allowed.discard(override["module_slug"])

    return ResolvedPermissions(allowed_modules=sorted(allowed))


@router.get("/me", response_model=ResolvedPermissions)
async def get_my_permissions(user=Depends(get_current_user)):
    """Get resolved module permissions for the current user."""
    supabase = get_supabase_client()
    return resolve_permissions(user["role"], user["id"], supabase)


@router.get("/modules", response_model=list[ModuleDefinition])
async def list_modules(user=Depends(get_current_user)):
    """List all module definitions."""
    supabase = get_supabase_client()
    result = (
        supabase.table("module_definitions")
        .select("slug, label, nav_group")
        .order("nav_group")
        .order("slug")
        .execute()
    )
    return [ModuleDefinition(**row) for row in result.data]


@router.get("/roles", response_model=dict[str, list[str]])
async def get_role_defaults(user=require_role("admin", "manager")):
    """Get all role-to-module mappings."""
    supabase = get_supabase_client()
    result = (
        supabase.table("role_module_defaults")
        .select("role, module_slug")
        .order("role")
        .execute()
    )

    role_map: dict[str, list[str]] = {}
    for row in result.data:
        role_map.setdefault(row["role"], []).append(row["module_slug"])

    return role_map


@router.put("/roles/{role}")
async def set_role_modules(role: str, body: SetRoleModulesRequest, user=require_role("admin")):
    """Replace the module list for a role."""
    valid_roles = [
        "admin", "manager", "sales_rep", "cultivation_lead",
        "manufacturing_lead", "packaging_lead", "fulfillment_lead",
        "driver", "viewer",
    ]
    if role not in valid_roles:
        raise HTTPException(status_code=400, detail=f"Invalid role: {role}")

    admin_client = get_supabase_admin()

    # Delete existing defaults for this role
    admin_client.table("role_module_defaults").delete().eq("role", role).execute()

    # Insert new defaults
    if body.module_slugs:
        rows = [{"role": role, "module_slug": slug} for slug in body.module_slugs]
        admin_client.table("role_module_defaults").insert(rows).execute()

    return {"message": f"Updated modules for role '{role}'", "count": len(body.module_slugs)}


@router.get("/users/{user_id}", response_model=UserPermissionsResponse)
async def get_user_permissions(user_id: str, user=require_role("admin", "manager")):
    """Get a specific user's resolved permissions and overrides."""
    supabase = get_supabase_client()

    # Get user profile for role
    profile = (
        supabase.table("profiles")
        .select("id, role")
        .eq("id", user_id)
        .single()
        .execute()
    )
    if not profile.data:
        raise HTTPException(status_code=404, detail="User not found")

    role = profile.data["role"]

    # Get role defaults
    defaults_result = (
        supabase.table("role_module_defaults")
        .select("module_slug")
        .eq("role", role)
        .execute()
    )
    role_defaults = sorted([row["module_slug"] for row in defaults_result.data])

    # Get overrides
    overrides_result = (
        supabase.table("user_module_overrides")
        .select("module_slug, granted")
        .eq("user_id", user_id)
        .execute()
    )
    overrides = [
        UserModuleOverride(module_slug=row["module_slug"], granted=row["granted"])
        for row in overrides_result.data
    ]

    # Resolve final list
    resolved = resolve_permissions(role, user_id, supabase)

    return UserPermissionsResponse(
        user_id=user_id,
        role=role,
        role_defaults=role_defaults,
        overrides=overrides,
        allowed_modules=resolved.allowed_modules,
    )


@router.put("/users/{user_id}/overrides")
async def set_user_overrides(
    user_id: str,
    body: SetOverridesRequest,
    user=require_role("admin"),
):
    """Set per-user module overrides (replaces all existing overrides)."""
    admin_client = get_supabase_admin()

    # Verify user exists
    profile = (
        admin_client.table("profiles")
        .select("id")
        .eq("id", user_id)
        .single()
        .execute()
    )
    if not profile.data:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete existing overrides
    admin_client.table("user_module_overrides").delete().eq("user_id", user_id).execute()

    # Insert new overrides
    if body.overrides:
        rows = [
            {
                "user_id": user_id,
                "module_slug": o.module_slug,
                "granted": o.granted,
                "granted_by": user["id"],
            }
            for o in body.overrides
        ]
        admin_client.table("user_module_overrides").insert(rows).execute()

    return {"message": f"Updated overrides for user '{user_id}'", "count": len(body.overrides)}
