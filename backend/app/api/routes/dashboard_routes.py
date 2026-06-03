from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.models.approval_request import ApprovalRequest
from app.models.audit_log import AuditLog

from app.cloud.aws_manager import (
    list_ec2_instances
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/summary")
def dashboard_summary(
    db: Session = Depends(get_db)
):

    ec2_data = list_ec2_instances()

    instances = ec2_data.get(
        "instances",
        []
    )

    total_instances = len(instances)

    running_instances = len([
        instance
        for instance in instances
        if instance.get("state", "").lower() == "running"
    ])

    pending_approvals = (
        db.query(ApprovalRequest)
        .filter(
            ApprovalRequest.status == "PENDING"
        )
        .count()
    )

    executed_actions = (
        db.query(AuditLog)
        .count()
    )

    approvals = (
        db.query(ApprovalRequest)
        .filter(
            ApprovalRequest.status == "APPROVED"
        )
        .all()
    )

    total_savings = sum(
        approval.estimated_savings
        for approval in approvals
    )

    return {
        "total_instances": total_instances,
        "running_instances": running_instances,
        "pending_approvals": pending_approvals,
        "executed_actions": executed_actions,
        "total_estimated_savings": total_savings
    }


@router.get("/recommendations")
def recommendations(
    db: Session = Depends(get_db)
):

    approvals = (
        db.query(ApprovalRequest)
        .all()
    )

    recommendations = []

    for approval in approvals:

        recommendations.append({
            "resource": approval.instance_id,
            "recommendation": approval.action,
            "estimated_savings": approval.estimated_savings,
            "status": approval.status
        })

    return recommendations


@router.get("/activity")
def activity_feed(
    db: Session = Depends(get_db)
):

    approvals = (
        db.query(ApprovalRequest)
        .all()
    )

    audit_logs = (
        db.query(AuditLog)
        .all()
    )

    activities = []

    for approval in approvals:

        activities.append({
            "type": approval.status,
            "message": (
                f"{approval.action} "
                f"for {approval.instance_id}"
            )
        })

    for log in audit_logs:

        activities.append({
            "type": "EXECUTED",
            "message": (
                f"{log.action} "
                f"executed on {log.instance_id}"
            )
        })

    return activities