from app.services.analysis_service import detect_anomalies


def generate_spend_insights(db):
    """
    Generate business insights from anomaly detection results.
    """

    analysis_result = detect_anomalies(db)

    anomalies = analysis_result.get("anomalies", [])

    # No anomalies found
    if not anomalies:
        return {
            "status": "success",
            "summary": "No significant anomalies detected.",
            "insights": [],
            "recommendations": [],
        }

    insights = []
    recommendations = []

    # Generate insights for each anomaly
    for anomaly in anomalies:
        department = anomaly["department"]
        service_name = anomaly["service_name"]
        vendor = anomaly["vendor"]
        cost_amount = anomaly["cost_amount"]
        z_score = anomaly["z_score"]

        insight = (
            f"{department} department shows unusually high spending "
            f"on {service_name} from {vendor}. "
            f"Detected cost: ${cost_amount} "
            f"(Z-score: {z_score})."
        )

        recommendation = (
            f"Review resource utilization for {service_name} "
            f"and evaluate optimization opportunities."
        )

        insights.append(insight)
        recommendations.append(recommendation)

    return {
        "status": "success",
        "summary": f"{len(anomalies)} anomalies detected.",
        "insights": insights,
        "recommendations": recommendations,
    }