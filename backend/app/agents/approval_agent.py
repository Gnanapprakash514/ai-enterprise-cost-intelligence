from app.agents.recommendation_agent import generate_recommendations


def evaluate_recommendations(db):
    """
    Evaluate recommendations and determine
    approval requirements.
    """

    recommendation_result = generate_recommendations(db)

    recommendations = recommendation_result.get(
        "recommendations",
        []
    )

    if not recommendations:
        return {
            "status": "success",
            "message": "No approvals required.",
            "approval_items": []
        }

    approval_items = []

    for recommendation in recommendations:

        savings = recommendation["estimated_monthly_savings"]

        approval_level = "Auto Approved"
        execution_allowed = True
        risk_level = "Low"

        # Approval rules
        if savings >= 20000:
            approval_level = "Executive Approval Required"
            execution_allowed = False
            risk_level = "High"

        elif savings >= 5000:
            approval_level = "Manager Approval Required"
            execution_allowed = False
            risk_level = "Medium"

        approval_items.append({
            "department": recommendation["department"],
            "service_name": recommendation["service_name"],
            "recommended_action": recommendation["recommended_action"],
            "estimated_monthly_savings": savings,
            "risk_level": risk_level,
            "approval_level": approval_level,
            "execution_allowed": execution_allowed
        })

    return {
        "status": "success",
        "total_items": len(approval_items),
        "approval_items": approval_items
    }