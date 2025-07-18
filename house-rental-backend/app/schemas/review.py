from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ReviewBase(BaseModel):
    agent_id: Optional[int] = None  # Optional field to link review to an agent
    author: str
    rating: int
    date: str
    comment: str
    
    class Config:
        from_attributes = True


class ReviewCreate(ReviewBase):
    agent_id: Optional[int] = None


class ReviewRead(ReviewBase):
    id: int

    class Config:
        from_attributes = True


class ReviewResponse(ReviewBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True