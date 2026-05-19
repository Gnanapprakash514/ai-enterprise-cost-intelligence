from sqlalchemy import Column,Integer,String,Float,Date,DateTime,func

from app.core import Base

class CostRecord(Base):
    __tablename__="cost_records"

    id=Column(Integer,primary_key=True,index=True)

    department=Column(String(100),nullable=False)
    service_name=Column(String(100),nullable=False)
    vendor=Column(String(100),nullable=False)
    cost_amount=Column(Float,nullable=False)
    currency=Column(String(10),nullable=False,default="USD")
    usage_quantity=Column(Float,nullable=True)
    usage_unit=Column(String(50),nullable=True)

    record_date=Column(Date,nullable=False)

    created_at=Column(DateTime(timezone=True),server_default=func.now(),nullable=False)