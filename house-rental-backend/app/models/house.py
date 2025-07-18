from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base


class House(Base):
    __tablename__ = "houses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    
    # Location
    address = Column(String, nullable=False)
    city = Column(String, nullable=False, index=True)
    state = Column(String, nullable=False)
    zip_code = Column(String, nullable=False)
    country = Column(String, default="USA")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Property Details
    property_type = Column(String, nullable=False)  # apartment, house, condo, townhouse
    bedrooms = Column(Integer, nullable=False)
    bathrooms = Column(Float, nullable=False)
    square_feet = Column(Integer, nullable=True)
    lot_size = Column(Float, nullable=True)
    year_built = Column(Integer, nullable=True)
    
    # Rental Information
    rent_price = Column(Float, nullable=False)
    security_deposit = Column(Float, nullable=True)
    lease_term = Column(String, nullable=True)  # "12 months", "month-to-month", etc.
    available_date = Column(DateTime, nullable=True)
    is_available = Column(Boolean, default=True)
    
    # Features and Amenities
    amenities = Column(JSON, nullable=True)  # List of amenities
    features = Column(JSON, nullable=True)  # List of features
    pet_policy = Column(String, nullable=True)  # "allowed", "not_allowed", "cats_only", etc.
    parking = Column(String, nullable=True)  # "garage", "driveway", "street", "none"
    
    # Media
    images = Column(JSON, nullable=True)  # List of image URLs
    virtual_tour_url = Column(String, nullable=True)
    floor_plan_url = Column(String, nullable=True)
    
    # Agent Information
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    
    # Metadata
    views_count = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    agent = relationship("Agent", back_populates="houses")

