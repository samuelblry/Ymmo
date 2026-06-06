from pydantic import BaseModel


class KpiResponse(BaseModel):
    label: str
    value: float | int | str


class PredictionResponse(BaseModel):
    ville: str
    prix_m2_moyen: float
    score_attractivite: float
    estimation_90m2: float
