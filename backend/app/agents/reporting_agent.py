from app.agents.monitoring_agent import monitor_executions


def generate_reports(db):
    """
    Generate executive optimization reports.
    """

    monitoring_result = monitor_executions(db)

    monitoring_results = monitoring_result.get(
        "monitoring_results",
        []
    )

    if not monitoring_results:
        return {
            "status": "success",
            "message": "No monitoring data available.",
            "report": {}
        }

    total_expected_savings = 0
    total_actual_savings = 0
    successful_optimizations = 0
    failed_optimizations = 0

    detailed_results = []

    for result in monitoring_results:

        if result.get("optimization_success"):

            successful_optimizations += 1

            expected = result.get(
                "expected_savings",
                0
            )

            actual = result.get(
                "actual_savings",
                0
            )

            total_expected_savings += expected
            total_actual_savings += actual

            detailed_results.append({
                "department": result["department"],
                "service_name": result["service_name"],
                "expected_savings": expected,
                "actual_savings": actual,
                "status": "Successful"
            })

        else:

            failed_optimizations += 1

            detailed_results.append({
                "department": result["department"],
                "service_name": result["service_name"],
                "status": result.get(
                    "status",
                    "Failed"
                )
            })

    success_rate = 0

    total_operations = (
        successful_optimizations +
        failed_optimizations
    )

    if total_operations > 0:
        success_rate = round(
            (successful_optimizations /
             total_operations) * 100,
            2
        )

    executive_summary = (
        f"The AI optimization platform processed "
        f"{total_operations} optimization workflows. "
        f"{successful_optimizations} optimizations "
        f"were successful with estimated savings "
        f"of ${round(total_actual_savings, 2)}."
    )

    return {
        "status": "success",
        "report": {
            "executive_summary": executive_summary,
            "total_operations": total_operations,
            "successful_optimizations": successful_optimizations,
            "failed_optimizations": failed_optimizations,
            "success_rate": success_rate,
            "total_expected_savings": round(
                total_expected_savings,
                2
            ),
            "total_actual_savings": round(
                total_actual_savings,
                2
            ),
            "details": detailed_results
        }
    }