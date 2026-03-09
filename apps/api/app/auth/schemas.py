from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class SignUpRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "viewer"


class LoginRequest(BaseModel):
    email: str
    password: str


class ProfileResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    department: Optional[str] = None
    title: Optional[str] = None
    avatar_url: Optional[str] = None
    language_preference: str = "en"
    phone: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    title: Optional[str] = None
    department: Optional[str] = None
    avatar_url: Optional[str] = None
    language_preference: Optional[str] = None
    phone: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: ProfileResponse


class SessionResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_at: Optional[int] = None


class UserCreateRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "viewer"
    department: Optional[str] = None
    title: Optional[str] = None


class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    department: Optional[str] = None
    title: Optional[str] = None
    is_active: Optional[bool] = None
