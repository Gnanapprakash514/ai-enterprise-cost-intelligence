from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.core import get_db
from app.services.upload_service import ingest_cost_data

router = APIRouter(
    prefix="/uploads",
    tags=["File Upload"],
)


@router.post("/cost-data")
def upload_cost_data(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload a CSV or XLSX file containing cost data
    and store all valid records in the database.
    """
    # Validate file extension
    allowed_extensions = (".csv", ".xlsx", ".xls")

    if not file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail="Only CSV and XLSX files are allowed.",
        )

    try:
        result = ingest_cost_data(db, file)
        return result

    except ValueError as e:
        # Validation errors (missing columns, unsupported format, etc.)
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:
        # Unexpected errors
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )