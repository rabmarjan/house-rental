
# AgentStats schema for nested response

from typing import Any
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class AgentStatsCreate(BaseModel):
    id: int
    agent_id: int
    total_rentals: Optional[int] = None
    average_response_time: Optional[str] = None
    client_satisfaction: Optional[str] = None
    repeat_clients: Optional[str] = None



class AgentStatsResponse(BaseModel):
    id: int
    agent_id: int
    total_rentals: Optional[int] = None
    average_response_time: Optional[str] = None
    client_satisfaction: Optional[str] = None
    repeat_clients: Optional[str] = None

    class Config:
        from_attributes = True 