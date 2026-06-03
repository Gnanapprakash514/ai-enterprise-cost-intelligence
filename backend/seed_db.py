import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.models.cost_record import CostRecord

def seed():
    # Make sure tables are created
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # Check if already seeded
        if db.query(CostRecord).count() > 0:
            print("Database already contains data. Skipping seeding.")
            return

        # Seed data matching MOCK_COST_RECORDS from frontend
        records = [
            CostRecord(department='Engineering', service_name='AWS EC2', vendor='AWS', cost_amount=14250.50, currency='USD', usage_quantity=720, usage_unit='Hrs', record_date=datetime.date(2026, 5, 28)),
            CostRecord(department='Data Science', service_name='AWS SageMaker', vendor='AWS', cost_amount=8900.20, currency='USD', usage_quantity=120, usage_unit='Hrs', record_date=datetime.date(2026, 5, 27)),
            CostRecord(department='Product QA', service_name='AWS EC2', vendor='AWS', cost_amount=1240.00, currency='USD', usage_quantity=450, usage_unit='Hrs', record_date=datetime.date(2026, 5, 28)),
            CostRecord(department='Engineering', service_name='AWS S3', vendor='AWS', cost_amount=4500.15, currency='USD', usage_quantity=90, usage_unit='TB', record_date=datetime.date(2026, 5, 26)),
            CostRecord(department='Security', service_name='AWS CloudTrail', vendor='AWS', cost_amount=800.00, currency='USD', usage_quantity=None, usage_unit=None, record_date=datetime.date(2026, 5, 25)),
            CostRecord(department='Data Science', service_name='Snowflake Warehouse', vendor='Snowflake', cost_amount=18450.00, currency='USD', usage_quantity=60, usage_unit='Credits', record_date=datetime.date(2026, 5, 28)),
            CostRecord(department='Engineering', service_name='Datadog Monitors', vendor='Datadog', cost_amount=3200.00, currency='USD', usage_quantity=45, usage_unit='Hosts', record_date=datetime.date(2026, 5, 24)),
            CostRecord(department='Marketing', service_name='AWS S3', vendor='AWS', cost_amount=180.20, currency='USD', usage_quantity=1.2, usage_unit='TB', record_date=datetime.date(2026, 5, 28)),
            CostRecord(department='Finance', service_name='AWS EC2', vendor='AWS', cost_amount=450.00, currency='USD', usage_quantity=15, usage_unit='Hrs', record_date=datetime.date(2026, 5, 28)),
            CostRecord(department='Engineering', service_name='Google Kubernetes Engine', vendor='GCP', cost_amount=11200.90, currency='USD', usage_quantity=180, usage_unit='Nodes', record_date=datetime.date(2026, 5, 28)),
        ]
        
        db.add_all(records)
        db.commit()
        print(f"Successfully seeded {len(records)} cost records into the database.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == '__main__':
    seed()
