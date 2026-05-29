from app.services.analysis_service import (
    detect_anomalies
)

from app.services.approval_service import (
    create_approval_request
)


def auto_generate_approvals(db):

    result = detect_anomalies(db)

    anomalies = result.get(
        "anomalies",
        []
    )

    created_requests = []

    for anomaly in anomalies:

        current_cost = anomaly.get(
            "current_cost",
            0
        )

        estimated_savings = round(
            current_cost * 0.30,
            2
        )

        request = create_approval_request(
            db=db,
            instance_id=anomaly.get(
                "service_name",
                "UNKNOWN_SERVICE"
            ),
            action="OPTIMIZE_RESOURCE",
            estimated_savings=estimated_savings
        )

        created_requests.append({
            "request_id": request.id,
            "resource": anomaly.get(
                "service_name"
            ),
            "estimated_savings": estimated_savings
        })

    return {
        "status": "success",
        "created_requests": created_requests
    }