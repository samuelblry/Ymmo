from pydantic import BaseModel


class ResetPasswordRequest(BaseModel):
    employe_id: int
    temporary_password: str


class MfaSetupResponse(BaseModel):
    secret: str
    provisioning_uri: str
