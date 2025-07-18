from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database.database import get_db
from app.core.security import get_current_user, get_current_agent, get_current_admin
from app.models.user import User
from app.models.agent import Agent
from app.models.house import House
from app.models.furniture_request import FurnitureRequest

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/agent/stats")
async def get_agent_stats(current_agent: Agent = Depends(get_current_agent), db: Session = Depends(get_db)):
    total_properties = db.query(House).filter(House.agent_id == current_agent.id).count()
    available_properties = db.query(House).filter(House.agent_id == current_agent.id, House.is_available == True).count()
    total_revenue = sum([house.rent_price for house in db.query(House).filter(House.agent_id == current_agent.id, House.is_available == False).all()])
    
    # Placeholder for agent rating and experience
    agent_rating = current_agent.rating if current_agent.rating else 4.5
    years_experience = current_agent.years_experience if current_agent.years_experience else 5

    recent_inquiries_count = db.query(FurnitureRequest).filter(FurnitureRequest.user_id == current_agent.id).count() # Simplified for now

    return {
        "total_properties": total_properties,
        "available_properties": available_properties,
        "total_revenue": total_revenue,
        "agent_rating": agent_rating,
        "years_experience": years_experience,
        "recent_inquiries_count": recent_inquiries_count
    }

@router.get("/agent/properties")
async def get_agent_properties(current_agent: Agent = Depends(get_current_agent), db: Session = Depends(get_db)):
    properties = db.query(House).filter(House.agent_id == current_agent.id).all()
    return {"properties": [
        {
            "id": prop.id,
            "title": prop.title,
            "address": prop.address,
            "bedrooms": prop.bedrooms,
            "bathrooms": prop.bathrooms,
            "square_feet": prop.square_feet,
            "rent_price": prop.rent_price,
            "is_available": prop.is_available
        } for prop in properties
    ]}

@router.get("/agent/inquiries")
async def get_agent_inquiries(current_agent: Agent = Depends(get_current_agent), db: Session = Depends(get_db)):
    inquiries = db.query(FurnitureRequest).filter(FurnitureRequest.user_id == current_agent.id).all()
    return {"inquiries": [
        {
            "id": req.id,
            "user_name": req.user.username if req.user else "Unknown",
            "property_title": req.pickup_city + " to " + req.delivery_city,
            "pickup_address": req.pickup_address,
            "delivery_address": req.delivery_address,
            "estimated_cost": req.estimated_cost,
            "created_at": req.created_at.isoformat() if req.created_at else None,
            "status": req.status
        } for req in inquiries
    ]}

@router.get("/agent/recent-activity")
async def get_agent_recent_activity(current_agent: Agent = Depends(get_current_agent), db: Session = Depends(get_db)):
    # This is a simplified example. In a real app, you'd track specific activities.
    activities = [
        {
            "type": "property_update",
            "title": "Updated property details for 123 Main St",
            "description": "Changed rent price to $2500",
            "timestamp": "2024-07-10T10:00:00Z"
        },
        {
            "type": "new_inquiry",
            "title": "New moving request for 456 Oak Ave",
            "description": "From John Doe",
            "timestamp": "2024-07-09T15:30:00Z"
        }
    ]
    return {"activities": activities}

@router.get("/admin/stats")
async def get_admin_stats(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    recent_users = db.query(User).filter(User.created_at >= "2024-06-01").count() # Placeholder for recent
    total_agents = db.query(Agent).count()
    recent_agents = db.query(Agent).filter(Agent.created_at >= "2024-06-01").count() # Placeholder for recent
    total_properties = db.query(House).count()
    available_properties = db.query(House).filter(House.is_available == True).count()
    rented_properties = db.query(House).filter(House.is_available == False).count()
    total_revenue = sum([house.rent_price for house in db.query(House).filter(House.is_available == False).all()])
    # Calculate average rating properly
    agents_with_ratings = db.query(Agent).filter(Agent.rating != None).all()
    average_rating = sum([agent.rating for agent in agents_with_ratings]) / len(agents_with_ratings) if agents_with_ratings else 0
    total_inquiries = db.query(FurnitureRequest).count()

    return {
        "total_users": total_users,
        "recent_users": recent_users,
        "total_agents": total_agents,
        "recent_agents": recent_agents,
        "total_properties": total_properties,
        "available_properties": available_properties,
        "rented_properties": rented_properties,
        "total_revenue": total_revenue,
        "average_rating": average_rating,
        "total_inquiries": total_inquiries
    }

@router.get("/admin/properties")
async def get_admin_properties(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    properties = db.query(House).all()
    return {"properties": [
        {
            "id": prop.id,
            "title": prop.title,
            "address": prop.address,
            "bedrooms": prop.bedrooms,
            "bathrooms": prop.bathrooms,
            "square_feet": prop.square_feet,
            "rent_price": prop.rent_price,
            "is_available": prop.is_available,
            "agent_name": prop.agent.full_name if prop.agent else "N/A"
        } for prop in properties
    ]}

@router.get("/admin/users")
async def get_admin_users(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(User).all()
    return {"users": [
        {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "is_active": user.is_active,
            "created_at": user.created_at.isoformat() if user.created_at else None
        } for user in users
    ]}

@router.get("/admin/agents")
async def get_admin_agents(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    agents = db.query(Agent).all()
    return {"agents": [
        {
            "id": agent.id,
            "full_name": agent.full_name,
            "email": agent.email,
            "phone": agent.phone,
            "license_number": agent.license_number,
            "years_experience": agent.years_experience,
            "rating": agent.rating,
            "is_active": agent.is_active,
            "created_at": agent.created_at.isoformat() if agent.created_at else None
        } for agent in agents
    ]}

@router.get("/admin/analytics")
async def get_admin_analytics(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    # Placeholder for more complex analytics
    monthly_revenue = [
        {"month": "Jan", "revenue": 15000},
        {"month": "Feb", "revenue": 18000},
        {"month": "Mar", "revenue": 22000},
    ]
    property_types = [
        {"type": "apartment", "count": 50},
        {"type": "house", "count": 30},
        {"type": "condo", "count": 20},
    ]
    return {"monthly_revenue": monthly_revenue, "property_types": property_types}


