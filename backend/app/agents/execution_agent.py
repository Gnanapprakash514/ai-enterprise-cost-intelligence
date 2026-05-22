from datetime import datetime

from app.agents.approval_agent import evaluate_recommendations


def execute_approved_actions(db):
    """
    Execute approved optimization actions.
    Currently simulated execution.
    """

    approval_result = evaluate_recommendations(db)

    approval_items = approval_result.get(
        "approval_items",
        []
    )

    if not approval_items:
        return {
            "status": "success",
            "message": "No actions available for execution.",
            "executions": []
        }

    executions = []

    for item in approval_items:

        execution_allowed = item["execution_allowed"]

        # Skip actions requiring approval
        if not execution_allowed:

            executions.append({
                "department": item["department"],
                "service_name": item["service_name"],
                "status": "Pending Approval",
                "executed": False,
                "timestamp": str(datetime.utcnow())
            })

            continue

        # Simulated execution
        executions.append({
            "department": item["department"],
            "service_name": item["service_name"],
            "action": item["recommended_action"],
            "status": "Executed Successfully",
            "executed": True,
            "timestamp": str(datetime.utcnow())
        })

    return {
        "status": "success",
        "total_actions": len(executions),
        "executions": executions
    }