from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    nom: str = Field(min_length=1, max_length=100)
    prenom: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    telephone: str | None = Field(default=None, max_length=20)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class MfaLoginRequest(BaseModel):
    temp_token: str
    code: str = Field(min_length=6, max_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_type: str
    role: str | None = None
    agence_id: int | None = None


class MfaRequiredResponse(BaseModel):
    require_mfa: bool = True
    temp_token: str
