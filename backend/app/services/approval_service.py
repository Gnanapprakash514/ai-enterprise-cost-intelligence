from app.models.approval_request import ApprovalRequest

from app.agents import (
    execute_ec2_shutdown
)

from app.services.audit_service import (
    create_audit_log
)


def create_approval_request(
    db,
    instance_id,
    action,
    estimated_savings=0
):

    request = ApprovalRequest(
        instance_id=instance_id,
        action=action,
        estimated_savings=estimated_savings
    )

    db.add(request)

    db.commit()

    db.refresh(request)

    return request


def approve_request(
    db,
    request_id
):

    request = (
        db.query(ApprovalRequest)
        .filter(
            ApprovalRequest.id == request_id
        )
        .first()
    )

    if not request:

        return {
            "status": "error",
            "message": "Request not found"
        }

    request.status = "APPROVED"

    db.commit()

    db.refresh(request)

    execution_result = execute_ec2_shutdown(
        request.instance_id
    )

    create_audit_log(
        db=db,
        instance_id=request.instance_id,
        action=request.action,
        status="EXECUTED"
    )

    return {
        "approval_status": request.status,
        "execution_result": execution_result
    }


def get_pending_requests(
    db
):

    requests = (
        db.query(ApprovalRequest)
        .filter(
            ApprovalRequest.status == "PENDING"
        )
        .all()
    )

    return requests

def reject_request(
    db,
    request_id
):

    request = (
        db.query(ApprovalRequest)
        .filter(
            ApprovalRequest.id == request_id
        )
        .first()
    )

    if not request:

        return {
            "status": "error",
            "message": "Request not found"
        }

    request.status = "REJECTED"

    db.commit()

    db.refresh(request)

    return {
        "status": "success",
        "request": request
    }