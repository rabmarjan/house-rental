from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.database import Base
from app.models.review import Review




class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    title = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    license_number = Column(String, unique=True, nullable=False)
    company = Column(String, nullable=True)
    specialties = Column(JSON, nullable=True , default=list)
    bio = Column(Text, nullable=True)
    profile_picture = Column(String, nullable=True)
    avatar = Column(String, nullable=True)
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    years_experience = Column(Integer, nullable=True)
    service_areas = Column(JSON, nullable=True, default=list)
    languages = Column(JSON, nullable=True, default=list)
    certifications = Column(JSON, nullable=True, default=list)
    achievements = Column(JSON, nullable=True, default=list)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    houses = relationship("House", back_populates="agent")
   # stats = relationship("AgentStats", uselist=False, back_populates="agent")
   # reviews = relationship("Review", back_populates="agent", cascade="all, delete-orphan")

# Import Review after both classes are defined

# Agent.reviews = relationship("Review", back_populates="agent", cascade="all, delete-orphan")


class AgentStats(Base):
    __tablename__ = 'agent_stats'

    id = Column(Integer, primary_key=True)
    agent_id = Column(Integer, ForeignKey('agents.id'))
    total_rentals = Column(Integer)
    average_response_time = Column(String)  # e.g., "2 hours"
    client_satisfaction = Column(String)    # e.g., "98%"
    repeat_clients = Column(String)         # e.g., "45%"

   # agent = relationship("Agent", back_populates="stats")

