from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from app.database import get_supabase_client
from app.auth.dependencies import get_current_user
from app.crm.schemas import (
    AccountCreate,
    AccountUpdate,
    AccountResponse,
    ContactCreate,
    ContactUpdate,
    ContactResponse,
    InteractionCreate,
    InteractionResponse,
    OpportunityCreate,
    OpportunityUpdate,
    OpportunityResponse,
    PipelineMoveRequest,
    PipelineMovementResponse,
    PipelineOverview,
    DashboardMetrics,
)
from app.crm.service import move_pipeline

router = APIRouter()


# --- Accounts ---


@router.get("/accounts", response_model=list[AccountResponse])
async def list_accounts(
    pipeline_status: Optional[str] = None,
    health_tier: Optional[str] = None,
    assigned_rep: Optional[str] = None,
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    user=Depends(get_current_user),
):
    supabase = get_supabase_client()
    query = supabase.table("accounts").select("*").eq("is_active", True)

    if pipeline_status:
        query = query.eq("pipeline_status", pipeline_status)
    if health_tier:
        query = query.eq("health_tier", health_tier)
    if assigned_rep:
        query = query.eq("assigned_rep_id", assigned_rep)
    if search:
        query = query.or_(f"name.ilike.%{search}%,license_number.ilike.%{search}%")

    offset = (page - 1) * per_page
    result = query.order("name").range(offset, offset + per_page - 1).execute()
    return [AccountResponse(**row) for row in result.data]


@router.get("/accounts/{account_id}", response_model=AccountResponse)
async def get_account(account_id: str, user=Depends(get_current_user)):
    supabase = get_supabase_client()
    result = (
        supabase.table("accounts")
        .select("*")
        .eq("id", account_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Account not found")

    return AccountResponse(**result.data)


@router.post("/accounts", response_model=AccountResponse)
async def create_account(body: AccountCreate, user=Depends(get_current_user)):
    if user["role"] not in ("admin", "manager", "sales_rep"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    supabase = get_supabase_client()
    result = (
        supabase.table("accounts")
        .insert(body.model_dump(exclude_none=True))
        .single()
        .execute()
    )

    # Log activity
    supabase.table("activity_log").insert(
        {
            "account_id": result.data["id"],
            "user_id": user["id"],
            "module": "crm",
            "action": "created",
            "description": f"Created account: {body.name}",
        }
    ).execute()

    return AccountResponse(**result.data)


@router.patch("/accounts/{account_id}", response_model=AccountResponse)
async def update_account(
    account_id: str, body: AccountUpdate, user=Depends(get_current_user)
):
    if user["role"] not in ("admin", "manager", "sales_rep"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    supabase = get_supabase_client()
    update_data = body.model_dump(exclude_none=True)

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        supabase.table("accounts")
        .update(update_data)
        .eq("id", account_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Account not found")

    return AccountResponse(**result.data)


@router.get(
    "/accounts/{account_id}/interactions",
    response_model=list[InteractionResponse],
)
async def get_account_interactions(
    account_id: str, user=Depends(get_current_user)
):
    supabase = get_supabase_client()
    result = (
        supabase.table("interactions")
        .select("*")
        .eq("account_id", account_id)
        .order("created_at", desc=True)
        .execute()
    )
    return [InteractionResponse(**row) for row in result.data]


@router.get(
    "/accounts/{account_id}/opportunities",
    response_model=list[OpportunityResponse],
)
async def get_account_opportunities(
    account_id: str, user=Depends(get_current_user)
):
    supabase = get_supabase_client()
    result = (
        supabase.table("opportunities")
        .select("*")
        .eq("account_id", account_id)
        .order("created_at", desc=True)
        .execute()
    )
    return [OpportunityResponse(**row) for row in result.data]


# --- Contacts ---


@router.get("/contacts", response_model=list[ContactResponse])
async def list_contacts(
    account_id: Optional[str] = None, user=Depends(get_current_user)
):
    supabase = get_supabase_client()
    query = supabase.table("contacts").select("*").eq("is_active", True)

    if account_id:
        query = query.eq("account_id", account_id)

    result = query.order("full_name").execute()
    return [ContactResponse(**row) for row in result.data]


@router.post("/contacts", response_model=ContactResponse)
async def create_contact(body: ContactCreate, user=Depends(get_current_user)):
    if user["role"] not in ("admin", "manager", "sales_rep"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    supabase = get_supabase_client()
    result = (
        supabase.table("contacts")
        .insert(body.model_dump(exclude_none=True))
        .single()
        .execute()
    )
    return ContactResponse(**result.data)


@router.patch("/contacts/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: str, body: ContactUpdate, user=Depends(get_current_user)
):
    if user["role"] not in ("admin", "manager", "sales_rep"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    supabase = get_supabase_client()
    update_data = body.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        supabase.table("contacts")
        .update(update_data)
        .eq("id", contact_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Contact not found")

    return ContactResponse(**result.data)


# --- Interactions ---


@router.get("/interactions", response_model=list[InteractionResponse])
async def list_interactions(
    account_id: Optional[str] = None,
    channel: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    user=Depends(get_current_user),
):
    supabase = get_supabase_client()
    query = supabase.table("interactions").select("*")

    if account_id:
        query = query.eq("account_id", account_id)
    if channel:
        query = query.eq("channel", channel)

    offset = (page - 1) * per_page
    result = (
        query.order("created_at", desc=True)
        .range(offset, offset + per_page - 1)
        .execute()
    )
    return [InteractionResponse(**row) for row in result.data]


@router.post("/interactions", response_model=InteractionResponse)
async def create_interaction(
    body: InteractionCreate, user=Depends(get_current_user)
):
    supabase = get_supabase_client()
    data = body.model_dump(exclude_none=True)
    data["user_id"] = user["id"]

    result = supabase.table("interactions").insert(data).single().execute()

    # Log activity
    supabase.table("activity_log").insert(
        {
            "account_id": body.account_id,
            "user_id": user["id"],
            "module": "crm",
            "action": "created",
            "description": f"New {body.channel} interaction",
            "metadata": {"channel": body.channel, "direction": body.direction},
        }
    ).execute()

    return InteractionResponse(**result.data)


# --- Opportunities ---


@router.get("/opportunities", response_model=list[OpportunityResponse])
async def list_opportunities(
    stage: Optional[str] = None,
    assigned_rep: Optional[str] = None,
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    user=Depends(get_current_user),
):
    supabase = get_supabase_client()
    query = supabase.table("opportunities").select("*")

    if stage:
        query = query.eq("stage", stage)
    if assigned_rep:
        query = query.eq("assigned_rep_id", assigned_rep)

    offset = (page - 1) * per_page
    result = (
        query.order("created_at", desc=True)
        .range(offset, offset + per_page - 1)
        .execute()
    )
    return [OpportunityResponse(**row) for row in result.data]


@router.post("/opportunities", response_model=OpportunityResponse)
async def create_opportunity(
    body: OpportunityCreate, user=Depends(get_current_user)
):
    if user["role"] not in ("admin", "manager", "sales_rep"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    supabase = get_supabase_client()
    result = (
        supabase.table("opportunities")
        .insert(body.model_dump(exclude_none=True))
        .single()
        .execute()
    )

    supabase.table("activity_log").insert(
        {
            "account_id": body.account_id,
            "user_id": user["id"],
            "module": "crm",
            "action": "created",
            "description": f"New opportunity: {body.title} (${body.value:,.0f})",
        }
    ).execute()

    return OpportunityResponse(**result.data)


@router.patch(
    "/opportunities/{opportunity_id}", response_model=OpportunityResponse
)
async def update_opportunity(
    opportunity_id: str,
    body: OpportunityUpdate,
    user=Depends(get_current_user),
):
    if user["role"] not in ("admin", "manager", "sales_rep"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    supabase = get_supabase_client()
    update_data = body.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        supabase.table("opportunities")
        .update(update_data)
        .eq("id", opportunity_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    return OpportunityResponse(**result.data)


# --- Pipeline ---


@router.get("/pipeline/overview", response_model=PipelineOverview)
async def get_pipeline_overview(user=Depends(get_current_user)):
    supabase = get_supabase_client()

    # Get all active accounts grouped by pipeline
    accounts = (
        supabase.table("accounts")
        .select("id, name, pipeline_status, pipeline_phase, pipeline_code, health_score")
        .eq("is_active", True)
        .execute()
    )

    # Build grid cells
    cells = {}
    for acct in accounts.data:
        key = f"{acct['pipeline_status']}_{acct['pipeline_phase']}"
        if key not in cells:
            cells[key] = {
                "status": acct["pipeline_status"],
                "phase": acct["pipeline_phase"],
                "count": 0,
                "accounts": [],
            }
        cells[key]["count"] += 1
        cells[key]["accounts"].append(
            {"id": acct["id"], "name": acct["name"], "health_score": acct["health_score"]}
        )

    # Get recent movements for velocity
    movements = (
        supabase.table("pipeline_movements")
        .select("direction, created_at")
        .order("created_at", desc=True)
        .limit(100)
        .execute()
    )

    advances = sum(1 for m in movements.data if m["direction"] == "advance")
    declines = sum(1 for m in movements.data if m["direction"] == "decline")

    return PipelineOverview(
        cells=list(cells.values()),
        total_accounts=len(accounts.data),
        velocity={
            "avg_days_per_phase": 0,
            "advances_this_month": advances,
            "declines_this_month": declines,
        },
    )


@router.get(
    "/pipeline/movements", response_model=list[PipelineMovementResponse]
)
async def get_pipeline_movements(
    limit: int = Query(20, ge=1, le=100), user=Depends(get_current_user)
):
    supabase = get_supabase_client()
    result = (
        supabase.table("pipeline_movements")
        .select("*")
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return [PipelineMovementResponse(**row) for row in result.data]


@router.post("/pipeline/move", response_model=PipelineMovementResponse)
async def move_account_pipeline(
    body: PipelineMoveRequest, user=Depends(get_current_user)
):
    if user["role"] not in ("admin", "manager", "sales_rep"):
        raise HTTPException(status_code=403, detail="Insufficient permissions")

    try:
        movement = await move_pipeline(
            account_id=body.account_id,
            to_status=body.to_status,
            to_phase=body.to_phase,
            reason=body.reason,
            moved_by=user["id"],
        )
        return PipelineMovementResponse(**movement)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# --- Dashboard ---


@router.get("/dashboard", response_model=DashboardMetrics)
async def get_dashboard(user=Depends(get_current_user)):
    supabase = get_supabase_client()

    # Get account aggregates
    accounts = (
        supabase.table("accounts")
        .select(
            "id, health_score, health_tier, total_revenue, pipeline_status, pipeline_phase"
        )
        .eq("is_active", True)
        .execute()
    )

    total_revenue = sum(a.get("total_revenue", 0) for a in accounts.data)
    active_count = sum(
        1 for a in accounts.data if a["pipeline_status"] == "active"
    )
    at_risk = sum(
        1 for a in accounts.data if a.get("health_tier") in ("at_risk", "churning")
    )
    avg_aov = (
        total_revenue / active_count if active_count > 0 else 0
    )

    # Pipeline overview
    pipeline = {}
    for a in accounts.data:
        key = a["pipeline_status"]
        pipeline[key] = pipeline.get(key, 0) + 1

    # Recent activity
    activity = (
        supabase.table("activity_log")
        .select("*")
        .order("created_at", desc=True)
        .limit(20)
        .execute()
    )

    return DashboardMetrics(
        total_revenue=total_revenue,
        active_accounts=active_count,
        avg_order_value=avg_aov,
        at_risk_accounts=at_risk,
        pipeline_overview=pipeline,
        recent_activity=activity.data,
    )
