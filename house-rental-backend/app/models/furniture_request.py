from sqlalchemy import Column, Integer, String, DateTime, Text, Float, JSON, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base
import enum


class RequestStatus(enum.Enum):
    PENDING = "pending"
    QUOTED = "quoted"
    ACCEPTED = "accepted"
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class FurnitureRequest(Base):
    __tablename__ = "furniture_requests"

    id = Column(Integer, primary_key=True, index=True)
    
    # User Information
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Moving Details
    pickup_address = Column(String, nullable=False)
    pickup_city = Column(String, nullable=False)
    pickup_state = Column(String, nullable=False)
    pickup_zip = Column(String, nullable=False)
    
    delivery_address = Column(String, nullable=False)
    delivery_city = Column(String, nullable=False)
    delivery_state = Column(String, nullable=False)
    delivery_zip = Column(String, nullable=False)
    
    # Service Details
    preferred_date = Column(DateTime, nullable=True)
    flexible_dates = Column(String, nullable=True)  # "yes", "no", "weekends_only"
    furniture_list = Column(JSON, nullable=False)  # List of furniture items with descriptions
    special_instructions = Column(Text, nullable=True)
    estimated_hours = Column(Float, nullable=True)
    
    # Pricing
    estimated_cost = Column(Float, nullable=True)
    final_cost = Column(Float, nullable=True)
    
    # Status and Tracking
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)
    assigned_company = Column(String, nullable=True)
    tracking_number = Column(String, nullable=True)
    
    # Contact Information
    contact_phone = Column(String, nullable=False)
    contact_email = Column(String, nullable=False)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    scheduled_date = Column(DateTime, nullable=True)
    completed_date = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="furniture_requests")


