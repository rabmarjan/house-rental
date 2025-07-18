from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class HouseBase(BaseModel):
    title: str
    description: str
    address: str
    city: str
    state: str
    zip_code: str
    country: str = "USA"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    property_type: str
    bedrooms: int
    bathrooms: float
    square_feet: Optional[int] = None
    lot_size: Optional[float] = None
    year_built: Optional[int] = None
    rent_price: float
    security_deposit: Optional[float] = None
    lease_term: Optional[str] = None
    available_date: Optional[datetime] = None
    amenities: Optional[List[str]] = None
    features: Optional[List[str]] = None
    pet_policy: Optional[str] = None
    parking: Optional[str] = None
    images: Optional[List[str]] = None
    virtual_tour_url: Optional[str] = None
    floor_plan_url: Optional[str] = None


class HouseCreate(HouseBase):
    agent_id: int


class HouseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    property_type: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    square_feet: Optional[int] = None
    lot_size: Optional[float] = None
    year_built: Optional[int] = None
    rent_price: Optional[float] = None
    security_deposit: Optional[float] = None
    lease_term: Optional[str] = None
    available_date: Optional[datetime] = None
    amenities: Optional[List[str]] = None
    features: Optional[List[str]] = None
    pet_policy: Optional[str] = None
    parking: Optional[str] = None
    images: Optional[List[str]] = None
    virtual_tour_url: Optional[str] = None
    floor_plan_url: Optional[str] = None
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None


class HouseSearch(BaseModel):
    city: Optional[str] = None
    state: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_bedrooms: Optional[int] = None
    max_bedrooms: Optional[int] = None
    min_bathrooms: Optional[float] = None
    max_bathrooms: Optional[float] = None
    property_type: Optional[str] = None
    amenities: Optional[List[str]] = None
    pet_policy: Optional[str] = None
    parking: Optional[str] = None
    available_only: bool = True
    limit: int = 20
    offset: int = 0


class HouseResponse(HouseBase):
    id: int
    agent_id: int
    is_available: bool
    is_featured: bool
    views_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

