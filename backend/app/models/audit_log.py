from sqlalchemy import (
    Column,
    Integer,
    String
)

from app.core.database import Base


class AuditLog(Base):

    __tablename__ = "audit_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    instance_id = Column(
        String,
        nullable=False
    )

    action = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        nullable=False
    )