from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.cloud.aws_manager import (
    list_ec2_instances
)
from app.models.approval_request import ApprovalRequest
from app.agents import (
    execute_ec2_shutdown
)
from app.models.audit_log import AuditLog
from app.core.database import get_db

from app.services.approval_service import (
    create_approval_request,
    approve_request,
    reject_request,
    get_pending_requests
)

router = APIRouter(
    prefix="/cloud",
    tags=["Cloud Automation"]
)


@router.get("/ec2-instances")
def get_ec2_instances():

    return list_ec2_instances()


@router.post("/stop-instance/{instance_id}")
def stop_instance(
    instance_id: str
):

    return execute_ec2_shutdown(
        instance_id
    )


@router.post("/request-stop/{instance_id}")
def request_stop(
    instance_id: str,
    db: Session = Depends(get_db)
):

    return create_approval_request(
        db=db,
        instance_id=instance_id,
        action="STOP_INSTANCE"
    )


@router.get("/pending-approvals")
def pending_approvals(
    db: Session = Depends(get_db)
):

    return get_pending_requests(db)

@router.get("/audit-logs")
def audit_logs(
    db: Session = Depends(get_db)
):

    return db.query(
        AuditLog
    ).all()
@router.post("/approve/{request_id}")
def approve(
    request_id: int,
    db: Session = Depends(get_db)
):

    return approve_request(
        db,
        request_id
    )

@router.post("/reject/{request_id}")
def reject(
    request_id: int,
    db: Session = Depends(get_db)
):

    return reject_request(
        db,
        request_id
    )

@router.get("/total-savings")
def total_savings(
    db: Session = Depends(get_db)
):

    approvals = db.query(
        ApprovalRequest
    ).all()

    total = sum(
        approval.estimated_savings
        for approval in approvals
    )

    return {
        "total_estimated_savings": total
    }