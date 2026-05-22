import pandas as pd
from sqlalchemy.orm import Session

from app.models import CostRecord


def detect_anomalies(db: Session):
    """
    Detect anomalous cost records using Z-score.
    Records with |z_score| > 2 are considered anomalies.
    """

    # Fetch all cost records
    records = db.query(CostRecord).all()

    # If no data exists
    if not records:
        return {
            "status": "success",
            "total_records": 0,
            "anomalies_found": 0,
            "anomalies": []
        }

    # Convert records to list of dictionaries
    data = []
    for record in records:
        data.append({
            "id": record.id,
            "department": record.department,
            "service_name": record.service_name,
            "vendor": record.vendor,
            "cost_amount": record.cost_amount,
            "record_date": str(record.record_date)
        })

    # Create DataFrame
    df = pd.DataFrame(data)

    # Calculate statistics
    mean_cost = df["cost_amount"].mean()
    std_cost = df["cost_amount"].std()

    # If all values are identical, no anomalies
    if std_cost == 0 or pd.isna(std_cost):
        return {
            "status": "success",
            "total_records": len(df),
            "anomalies_found": 0,
            "anomalies": []
        }

    # Calculate Z-score
    df["z_score"] = (df["cost_amount"] - mean_cost) / std_cost

    # Detect anomalies (absolute Z-score > 2)
    anomalies_df = df[df["z_score"].abs() > 2]

    # Convert anomalies to JSON-serializable format
    anomalies = []
    for _, row in anomalies_df.iterrows():
        anomalies.append({
            "id": int(row["id"]),
            "department": row["department"],
            "service_name": row["service_name"],
            "vendor": row["vendor"],
            "cost_amount": float(row["cost_amount"]),
            "record_date": row["record_date"],
            "z_score": round(float(row["z_score"]), 2)
        })

    return {
        "status": "success",
        "total_records": len(df),
        "mean_cost": round(float(mean_cost), 2),
        "standard_deviation": round(float(std_cost), 2),
        "anomalies_found": len(anomalies),
        "anomalies": anomalies
    }