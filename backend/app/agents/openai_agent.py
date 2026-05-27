from app.services.analysis_service import (
    detect_anomalies
)

from app.langchain.chains import (
    cost_analysis_chain
)


def generate_ai_insights(db):

    analysis_result = detect_anomalies(db)

    anomalies = analysis_result.get(
        "anomalies",
        []
    )

    if not anomalies:
        return {
            "status": "success",
            "message": "No anomalies detected"
        }

    try:

        response = cost_analysis_chain.run(
            anomalies=str(anomalies)
        )

        return {
            "status": "success",
            "ai_insights": response
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }