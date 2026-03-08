from app.database import get_supabase_client


def calculate_pipeline_direction(from_code: str, to_code: str) -> str:
    """Determine if a pipeline move is an advance, decline, or lateral."""
    from_phase = int(from_code[1]) if len(from_code) >= 2 else 0
    to_phase = int(to_code[1]) if len(to_code) >= 2 else 0

    status_rank = {"I": 0, "R": 1, "A": 2}
    from_rank = status_rank.get(from_code[0].upper(), 0)
    to_rank = status_rank.get(to_code[0].upper(), 0)

    if to_rank > from_rank or (to_rank == from_rank and to_phase > from_phase):
        return "advance"
    elif to_rank < from_rank or (to_rank == from_rank and to_phase < from_phase):
        return "decline"
    return "lateral"


async def move_pipeline(
    account_id: str,
    to_status: str,
    to_phase: int,
    reason: str | None,
    moved_by: str,
) -> dict:
    """Move an account to a new pipeline stage. Returns the movement record."""
    supabase = get_supabase_client()

    # Get current account state
    account = (
        supabase.table("accounts")
        .select("pipeline_status, pipeline_phase, pipeline_code")
        .eq("id", account_id)
        .single()
        .execute()
    )

    if not account.data:
        raise ValueError(f"Account {account_id} not found")

    from_code = account.data["pipeline_code"]
    to_code = to_status[0].upper() + str(to_phase)
    direction = calculate_pipeline_direction(from_code, to_code)

    # Update account
    supabase.table("accounts").update(
        {
            "pipeline_status": to_status,
            "pipeline_phase": to_phase,
            "pipeline_previous_code": from_code,
            "pipeline_previous_date": account.data.get("pipeline_entered_date"),
            "pipeline_entered_date": "now()",
            "pipeline_notes": reason,
        }
    ).eq("id", account_id).execute()

    # Create movement record
    movement = (
        supabase.table("pipeline_movements")
        .insert(
            {
                "account_id": account_id,
                "from_code": from_code,
                "to_code": to_code,
                "reason": reason,
                "direction": direction,
                "moved_by": moved_by,
            }
        )
        .single()
        .execute()
    )

    # Log activity
    supabase.table("activity_log").insert(
        {
            "account_id": account_id,
            "user_id": moved_by,
            "module": "pipeline",
            "action": "status_change",
            "description": f"Pipeline moved from {from_code} to {to_code}",
            "metadata": {
                "from_code": from_code,
                "to_code": to_code,
                "direction": direction,
                "reason": reason,
            },
        }
    ).execute()

    return movement.data


def calculate_health_score(account_id: str) -> int:
    """Recalculate health score based on multiple factors. Returns new score."""
    supabase = get_supabase_client()

    account = (
        supabase.table("accounts")
        .select("*")
        .eq("id", account_id)
        .single()
        .execute()
    )

    if not account.data:
        return 50

    data = account.data
    score = 50  # Base score

    # Revenue factor (+/- 15)
    if data.get("total_revenue", 0) > 100000:
        score += 15
    elif data.get("total_revenue", 0) > 50000:
        score += 10
    elif data.get("total_revenue", 0) > 10000:
        score += 5

    # Order recency factor (+/- 15)
    days_since = data.get("days_since_last_order")
    if days_since is not None:
        if days_since <= 14:
            score += 15
        elif days_since <= 30:
            score += 10
        elif days_since <= 60:
            score += 0
        elif days_since <= 90:
            score -= 10
        else:
            score -= 15

    # Pipeline status factor (+/- 10)
    if data.get("pipeline_status") == "active":
        score += 10
    elif data.get("pipeline_status") == "recovery":
        score -= 5
    elif data.get("pipeline_status") == "inactive":
        score -= 10

    # VMI enrollment factor (+5)
    if data.get("vmi_enrolled"):
        score += 5

    return max(0, min(100, score))
