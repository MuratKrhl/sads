"""
backend/app/models/auth.py
───────────────────────────
Auth endpoint'leri için Pydantic modelleri.
"""

from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class UserInfo(BaseModel):
    username: str
    full_name: str | None = None
    email: str | None = None
    role: str = "user"


class MessageResponse(BaseModel):
    detail: str
