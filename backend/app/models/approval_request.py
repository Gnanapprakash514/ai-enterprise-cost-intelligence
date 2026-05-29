from sqlalchemy import Column, Integer, String,Float

from app.core.database import Base


class ApprovalRequest(Base):

    __tablename__ = "approval_requests"

    id = Column(Integer, primary_key=True, index=True)

    instance_id = Column(String, nullable=False)

    action = Column(String, nullable=False)
    estimated_savings = Column(
        Float,
        default=0
    )
    
    status = Column(
        String,
        default="PENDING"
    )