from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core import get_db
from app.schemas import CostRecordCreate, CostRecordResponse
from app.services import (
    create_cost_record,
    get_all_cost_records,
    get_cost_record_by_id,
)

router = APIRouter(
    prefix="/cost-records",
    tags=["Cost Records"],
)


@router.post("/", response_model=CostRecordResponse)
def create_record(
    cost_data: CostRecordCreate,
    db: Session = Depends(get_db),
):
    return create_cost_record(db, cost_data)


@router.get("/", response_model=List[CostRecordResponse])
def get_records(
    db: Session = Depends(get_db),
):
    return get_all_cost_records(db)


@router.get("/{record_id}", response_model=CostRecordResponse)
def get_record(
    record_id: int,
    db: Session = Depends(get_db),
):
    record = get_cost_record_by_id(db, record_id)

    if not record:
        raise HTTPException(
            status_code=404,
            detail="Cost record not found",
        )

    return record