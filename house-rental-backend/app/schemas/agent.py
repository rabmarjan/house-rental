
# AgentStats schema for nested response

from typing import Any
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Import ReviewBase for nested reviews
from app.schemas.review import ReviewBase


class AgentBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    title: Optional[str] = None
    phone: str
    license_number: str
    company: Optional[str] = None
    specialties: Optional[List[str]] = None
    bio: Optional[str] = None
    years_experience: Optional[int] = None
    service_areas: Optional[List[str]] = None
    specialties: Optional[List[str]] = None 
    languages: Optional[List[str]] = None 
    certifications: Optional[List[str]] = None  
    achievements: Optional[List[str]] = None 
    profile_picture: Optional[str] = None
    avatar: Optional[str] = None

# class AgentStatsResponse(BaseModel):
#     id: int
#     agent_id: int
#     total_rentals: Optional[int] = None
#     average_response_time: Optional[str] = None
#     client_satisfaction: Optional[str] = None
#     repeat_clients: Optional[str] = None

#     class Config:
#         from_attributes = True 

class AgentCreate(AgentBase):
    password: str


class AgentUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    specialties: Optional[List[str]] = None
    bio: Optional[str] = None
    profile_picture: Optional[str] = None
    years_experience: Optional[int] = None
    service_areas: Optional[List[str]] = None


class AgentLogin(BaseModel):
    username: str
    password: str


class AgentResponse(AgentBase):

    id: int
    rating: float
    total_reviews: int
   # stats: Optional[AgentStatsResponse] = None
  #  reviews: Optional[List[ReviewBase]] = None
    is_active: bool
    is_verified: bool
    profile_picture: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
       

