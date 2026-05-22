from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


from app.core import get_db
from app.agents import *

router = APIRouter(
    prefix="/agents",
    tags=["AI Agents"],
)


@router.get("/spend-intelligence")
def run_spend_intelligence_agent(
    db: Session = Depends(get_db),
):
    return generate_spend_insights(db)

@router.get("/approvals")
def get_approval_decisions(
    db: Session = Depends(get_db),
):
    return evaluate_recommendations(db)

@router.get("/recommendations")
def get_recommendations(
    db: Session = Depends(get_db),
):
    return generate_recommendations(db)