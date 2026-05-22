from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core import get_db
from app.services.analysis_service import detect_anomalies

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


@router.get("/anomalies")
def get_anomalies(
    db: Session = Depends(get_db),
):
    return detect_anomalies(db)