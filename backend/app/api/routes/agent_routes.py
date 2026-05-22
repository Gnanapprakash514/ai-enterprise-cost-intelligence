from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core import get_db
from app.agents import generate_spend_insights

router = APIRouter(
    prefix="/agents",
    tags=["AI Agents"],
)


@router.get("/spend-intelligence")
def run_spend_intelligence_agent(
    db: Session = Depends(get_db),
):
    return generate_spend_insights(db)