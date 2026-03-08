from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional


# --- Accounts ---


class AccountCreate(BaseModel):
    name: str
    legal_name: Optional[str] = None
    license_number: Optional[str] = None
    license_expiry: Optional[date] = None
    account_type: str = "dispensary"
    address_street: Optional[str] = None
    address_city: Optional[str] = None
    address_state: str = "WA"
    address_zip: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    pipeline_status: str = "inactive"
    pipeline_phase: int = 1
    health_score: int = 50
    vmi_enrolled: bool = False
    preferred_delivery_window: Optional[str] = None
    delivery_instructions: Optional[str] = None
    assigned_rep_id: Optional[str] = None


class AccountUpdate(BaseModel):
    name: Optional[str] = None
    legal_name: Optional[str] = None
    license_number: Optional[str] = None
    license_expiry: Optional[date] = None
    account_type: Optional[str] = None
    address_street: Optional[str] = None
    address_city: Optional[str] = None
    address_state: Optional[str] = None
    address_zip: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    health_score: Optional[int] = None
    vmi_enrolled: Optional[bool] = None
    preferred_delivery_window: Optional[str] = None
    delivery_instructions: Optional[str] = None
    assigned_rep_id: Optional[str] = None
    is_active: Optional[bool] = None


class AccountResponse(BaseModel):
    id: str
    name: str
    legal_name: Optional[str] = None
    license_number: Optional[str] = None
    license_expiry: Optional[date] = None
    account_type: str
    address_street: Optional[str] = None
    address_city: Optional[str] = None
    address_state: Optional[str] = None
    address_zip: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    pipeline_status: str
    pipeline_phase: int
    pipeline_code: Optional[str] = None
    pipeline_entered_date: Optional[datetime] = None
    pipeline_previous_code: Optional[str] = None
    pipeline_previous_date: Optional[datetime] = None
    pipeline_notes: Optional[str] = None
    health_score: int
    health_tier: Optional[str] = None
    total_revenue: float = 0
    total_orders: int = 0
    average_order_value: float = 0
    last_order_date: Optional[datetime] = None
    order_cadence_days: Optional[int] = None
    days_since_last_order: Optional[int] = None
    vmi_enrolled: bool = False
    preferred_delivery_window: Optional[str] = None
    delivery_instructions: Optional[str] = None
    assigned_rep_id: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_active: bool = True


# --- Contacts ---


class ContactCreate(BaseModel):
    account_id: str
    full_name: str
    title: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    is_primary: bool = False
    notes: Optional[str] = None


class ContactUpdate(BaseModel):
    full_name: Optional[str] = None
    title: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    is_primary: Optional[bool] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None


class ContactResponse(BaseModel):
    id: str
    account_id: str
    full_name: str
    title: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    is_primary: bool = False
    is_active: bool = True
    notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# --- Interactions ---


class InteractionCreate(BaseModel):
    account_id: str
    contact_id: Optional[str] = None
    channel: str
    direction: str = "outbound"
    subject: Optional[str] = None
    content: Optional[str] = None
    sentiment: Optional[str] = None
    meeting_date: Optional[datetime] = None
    meeting_duration_minutes: Optional[int] = None
    is_ai_generated: bool = False


class InteractionResponse(BaseModel):
    id: str
    account_id: str
    contact_id: Optional[str] = None
    user_id: Optional[str] = None
    channel: str
    direction: str
    subject: Optional[str] = None
    content: Optional[str] = None
    sentiment: Optional[str] = None
    meeting_date: Optional[datetime] = None
    meeting_duration_minutes: Optional[int] = None
    created_at: Optional[datetime] = None
    is_ai_generated: bool = False


# --- Opportunities ---


class OpportunityCreate(BaseModel):
    account_id: str
    title: str
    value: float = 0
    stage: str = "prospecting"
    probability: int = 25
    expected_close_date: Optional[date] = None
    category: Optional[str] = None
    assigned_rep_id: Optional[str] = None
    notes: Optional[str] = None


class OpportunityUpdate(BaseModel):
    title: Optional[str] = None
    value: Optional[float] = None
    stage: Optional[str] = None
    probability: Optional[int] = None
    expected_close_date: Optional[date] = None
    category: Optional[str] = None
    assigned_rep_id: Optional[str] = None
    notes: Optional[str] = None
    closed_at: Optional[datetime] = None
    close_reason: Optional[str] = None


class OpportunityResponse(BaseModel):
    id: str
    account_id: str
    title: str
    value: float
    stage: str
    probability: int
    expected_close_date: Optional[date] = None
    category: Optional[str] = None
    assigned_rep_id: Optional[str] = None
    notes: Optional[str] = None
    closed_at: Optional[datetime] = None
    close_reason: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# --- Pipeline ---


class PipelineMoveRequest(BaseModel):
    account_id: str
    to_status: str
    to_phase: int
    reason: Optional[str] = None


class PipelineMovementResponse(BaseModel):
    id: str
    account_id: str
    from_code: str
    to_code: str
    reason: Optional[str] = None
    direction: str
    moved_by: Optional[str] = None
    created_at: Optional[datetime] = None


class PipelineOverview(BaseModel):
    cells: list[dict]  # [{status, phase, count, accounts}]
    total_accounts: int
    velocity: dict  # {avg_days_per_phase, advances_this_month, declines_this_month}


# --- Dashboard ---


class DashboardMetrics(BaseModel):
    total_revenue: float
    active_accounts: int
    avg_order_value: float
    at_risk_accounts: int
    pipeline_overview: dict
    recent_activity: list[dict]
