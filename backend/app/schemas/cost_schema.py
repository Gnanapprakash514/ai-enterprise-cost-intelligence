from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class CostRecordBase(BaseModel):
    department: str
    service_name: str
    vendor: str
    cost_amount: float
    currency: str = "USD"
    usage_quantity: Optional[float] = None
    usage_unit: Optional[str] = None
    record_date: date


class CostRecordCreate(CostRecordBase):
    pass


class CostRecordResponse(CostRecordBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True