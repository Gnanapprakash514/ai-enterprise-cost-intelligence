import random

from app.agents.execution_agent import execute_approved_actions


def monitor_executions(db):
    """
    Monitor optimization results and
    compare expected vs actual savings.
    """

    execution_result = execute_approved_actions(db)

    executions = execution_result.get(
        "executions",
        []
    )

    if not executions:
        return {
            "status": "success",
            "message": "No execution data available.",
            "monitoring_results": []
        }

    monitoring_results = []

    for execution in executions:

        if not execution["executed"]:

            monitoring_results.append({
                "department": execution["department"],
                "service_name": execution["service_name"],
                "status": "Awaiting Approval",
                "optimization_success": False
            })

            continue

        # Simulated savings monitoring
        expected_savings = random.randint(5000, 20000)

        actual_savings = round(
            expected_savings * random.uniform(0.75, 1.0),
            2
        )

        optimization_success = actual_savings >= (
            expected_savings * 0.8
        )

        monitoring_results.append({
            "department": execution["department"],
            "service_name": execution["service_name"],
            "expected_savings": expected_savings,
            "actual_savings": actual_savings,
            "optimization_success": optimization_success,
            "status": "Monitored"
        })

    return {
        "status": "success",
        "total_monitored": len(monitoring_results),
        "monitoring_results": monitoring_results
    }