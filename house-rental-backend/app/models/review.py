from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base

class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True)
    author = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    date = Column(String, nullable=False)  # Consider storing as a `DateTime` for production
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True))
    updated_at = Column(DateTime(timezone=True))
   
    # Optional relationship to Agent (if you want to tie review to an agent)
    agent_id = Column(Integer, ForeignKey('agents.id'), nullable=True)
   # agent = relationship("Agent", back_populates="reviews")
