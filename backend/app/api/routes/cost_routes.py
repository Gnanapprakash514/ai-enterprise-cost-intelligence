from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core import get_db
from app.models import CostRecord
from app.schemas import CostRecordCreate, CostRecordResponse

router = APIRouter(
    prefix="/cost-records",
    tags=["Cost Records"]
)


@router.post("/", response_model=CostRecordResponse)
def create_cost_record(
    cost_data: CostRecordCreate,
    db: Session = Depends(get_db)
):
    new_record = CostRecord(**cost_data.model_dump())

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return new_record


@router.get("/", response_model=List[CostRecordResponse])
def get_all_cost_records(
    db: Session = Depends(get_db)
):
    records = db.query(CostRecord).all()
    return records


@router.get("/{record_id}", response_model=CostRecordResponse)
def get_cost_record(
    record_id: int,
    db: Session = Depends(get_db)
):
    record = (
        db.query(CostRecord)
        .filter(CostRecord.id == record_id)
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Cost record not found"
        )

    return record