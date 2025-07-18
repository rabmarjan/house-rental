from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.furniture_request import RequestStatus


class FurnitureRequestBase(BaseModel):
    pickup_address: str
    pickup_city: str
    pickup_state: str
    pickup_zip: str
    delivery_address: str
    delivery_city: str
    delivery_state: str
    delivery_zip: str
    preferred_date: Optional[datetime] = None
    flexible_dates: Optional[str] = None
    furniture_list: List[str]
    special_instructions: Optional[str] = None
    contact_phone: str
    contact_email: EmailStr


class FurnitureRequestCreate(FurnitureRequestBase):
    user_id: int


class FurnitureRequestUpdate(BaseModel):
    pickup_address: Optional[str] = None
    pickup_city: Optional[str] = None
    pickup_state: Optional[str] = None
    pickup_zip: Optional[str] = None
    delivery_address: Optional[str] = None
    delivery_city: Optional[str] = None
    delivery_state: Optional[str] = None
    delivery_zip: Optional[str] = None
    preferred_date: Optional[datetime] = None
    flexible_dates: Optional[str] = None
    furniture_list: Optional[List[str]] = None
    special_instructions: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    estimated_hours: Optional[float] = None
    estimated_cost: Optional[float] = None
    final_cost: Optional[float] = None
    status: Optional[RequestStatus] = None
    assigned_company: Optional[str] = None
    tracking_number: Optional[str] = None
    scheduled_date: Optional[datetime] = None


class FurnitureRequestResponse(FurnitureRequestBase):
    id: int
    user_id: int
    estimated_hours: Optional[float] = None
    estimated_cost: Optional[float] = None
    final_cost: Optional[float] = None
    status: RequestStatus
    assigned_company: Optional[str] = None
    tracking_number: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    scheduled_date: Optional[datetime] = None
    completed_date: Optional[datetime] = None

    class Config:
        from_attributes = True

