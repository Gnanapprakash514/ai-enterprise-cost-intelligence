from app.services.analysis_service import detect_anomalies


def generate_recommendations(db):
    """
    Generate optimization recommendations
    based on detected anomalies.
    """

    analysis_result = detect_anomalies(db)

    anomalies = analysis_result.get("anomalies", [])

    # No anomalies
    if not anomalies:
        return {
            "status": "success",
            "recommendations": [],
            "message": "No optimization recommendations required."
        }

    recommendations = []

    for anomaly in anomalies:

        service_name = anomaly["service_name"]
        vendor = anomaly["vendor"]
        cost_amount = anomaly["cost_amount"]

        action = "Review spending"

        # Rule-based recommendations
        if "EC2" in service_name:
            action = "Right-size or terminate underutilized EC2 instances"

        elif "RDS" in service_name:
            action = "Optimize database instance sizing"

        elif "S3" in service_name:
            action = "Move infrequently accessed data to cheaper storage tiers"

        elif "License" in service_name:
            action = "Deactivate unused software licenses"

        # Estimated savings logic
        estimated_savings = round(cost_amount * 0.30, 2)

        recommendations.append({
            "department": anomaly["department"],
            "service_name": service_name,
            "vendor": vendor,
            "current_cost": cost_amount,
            "recommended_action": action,
            "priority": "High" if cost_amount > 20000 else "Medium",
            "estimated_monthly_savings": estimated_savings
        })

    return {
        "status": "success",
        "total_recommendations": len(recommendations),
        "recommendations": recommendations
    }