from sqlalchemy.orm import Session
from app.models import CostRecord
from app.schemas import CostRecordCreate

def create_cost_record(db:Session,cost_data:CostRecordCreate)->CostRecord:
    new_record=CostRecord(**cost_data.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

def get_all_cost_records(db:Session):
    return db.query(CostRecord).all()

def get_cost_record_by_id(db:Session,record_id:int):
    return db.query(CostRecord).filter(CostRecord.id==record_id).first()
