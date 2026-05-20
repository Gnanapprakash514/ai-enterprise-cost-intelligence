import os
import shutil
from pathlib import Path

import pandas as pd
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models import CostRecord


# Folder where uploaded files will be stored temporarily
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def save_uploaded_file(file: UploadFile) -> Path:
    """
    Save the uploaded file to the uploads directory
    and return the saved file path.
    """
    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_path


def read_uploaded_file(file_path: Path) -> pd.DataFrame:
    """
    Read CSV or Excel file into a pandas DataFrame.
    """
    suffix = file_path.suffix.lower()

    if suffix == ".csv":
        return pd.read_csv(file_path)

    elif suffix in [".xlsx", ".xls"]:
        return pd.read_excel(file_path)

    else:
        raise ValueError("Unsupported file format. Only CSV and XLSX are allowed.")


def validate_required_columns(df: pd.DataFrame):
    """
    Ensure all required columns are present.
    """
    required_columns = [
        "department",
        "service_name",
        "vendor",
        "cost_amount",
        "record_date",
    ]

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {', '.join(missing_columns)}"
        )


def ingest_cost_data(db: Session, file: UploadFile):
    """
    Complete upload pipeline:
    1. Save file
    2. Read into DataFrame
    3. Validate columns
    4. Insert into database
    5. Return summary
    """
    # Save uploaded file
    file_path = save_uploaded_file(file)

    # Read file
    df = read_uploaded_file(file_path)

    # Validate columns
    validate_required_columns(df)

    inserted_count = 0

    # Iterate through each row
    for _, row in df.iterrows():
        cost_record = CostRecord(
            department=row["department"],
            service_name=row["service_name"],
            vendor=row["vendor"],
            cost_amount=float(row["cost_amount"]),
            currency=row.get("currency", "USD"),
            usage_quantity=row.get("usage_quantity"),
            usage_unit=row.get("usage_unit"),
            record_date=pd.to_datetime(row["record_date"]).date(),
        )

        db.add(cost_record)
        inserted_count += 1

    # Save all records to database
    db.commit()

    # Optional cleanup: remove uploaded file after processing
    if os.path.exists(file_path):
        os.remove(file_path)

    return {
        "status": "success",
        "records_processed": len(df),
        "records_inserted": inserted_count,
    }