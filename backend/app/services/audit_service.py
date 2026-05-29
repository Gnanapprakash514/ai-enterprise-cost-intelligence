from app.models.audit_log import AuditLog


def create_audit_log(
    db,
    instance_id,
    action,
    status
):

    log = AuditLog(
        instance_id=instance_id,
        action=action,
        status=status
    )

    db.add(log)

    db.commit()

    db.refresh(log)

    return log