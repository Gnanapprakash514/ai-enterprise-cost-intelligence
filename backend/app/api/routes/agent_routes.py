from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.services.automation_service import (
    auto_generate_approvals
)
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

@router.get("/execute")
def execute_actions(
    db: Session = Depends(get_db),
):
    return execute_approved_actions(db)

@router.get("/monitor")
def monitor_actions(
    db: Session = Depends(get_db),
):
    return monitor_executions(db)

@router.get("/reports")
def get_reports(
    db: Session = Depends(get_db),
):
    return generate_reports(db)

@router.get("/autonomous-execution")
def autonomous_execution():

    return autonomous_optimization()

@router.post(
    "/auto-generate-approvals"
)
def generate_approvals(
    db: Session = Depends(get_db)
):

    return auto_generate_approvals(
        db
    )

@router.get("/ai-insights")
def get_ai_insights(
    db: Session = Depends(get_db)
):

    return generate_ai_insights(db)