#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.database.database import SessionLocal, engine
from app.models import User, Agent, House, FurnitureRequest
from app.core.security import get_password_hash
from datetime import datetime

def create_sample_data():
    db = SessionLocal()
    
    try:
        # Create sample users
        users_data = [
            {
                "email": "john.smith@email.com",
                "username": "johnsmith",
                "hashed_password": get_password_hash("password123"),
                "full_name": "John Smith",
                "phone": "(555) 123-4567",
                "is_active": True
            },
            {
                "email": "jane.doe@email.com",
                "username": "janedoe", 
                "hashed_password": get_password_hash("password123"),
                "full_name": "Jane Doe",
                "phone": "(555) 987-6543",
                "is_active": True
            },
            {
                "email": "mike.wilson@email.com",
                "username": "mikewilson",
                "hashed_password": get_password_hash("password123"),
                "full_name": "Mike Wilson", 
                "phone": "(555) 456-7890",
                "is_active": True
            }
        ]
        
        for user_data in users_data:
            # Check if user already exists
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing_user:
                user = User(**user_data)
                db.add(user)
        
        db.commit()
        
        # Create sample agents
        agents_data = [
            {
                "email": "sarah.johnson@realty.com",
                "username": "sarahjohnson",
                "hashed_password": get_password_hash("agent123"),
                "full_name": "Sarah Johnson",
                "phone": "(555) 111-2222",
                "license_number": "RE123456",
                "rating": 4.8,
                "years_experience": 5,
                "is_active": True
            },
            {
                "email": "mike.chen@realty.com",
                "username": "mikechen",
                "hashed_password": get_password_hash("agent123"),
                "full_name": "Mike Chen",
                "phone": "(555) 333-4444",
                "license_number": "RE789012",
                "rating": 4.9,
                "years_experience": 8,
                "is_active": True
            },
            {
                "email": "emily.davis@realty.com",
                "username": "emilydavis",
                "hashed_password": get_password_hash("agent123"),
                "full_name": "Emily Davis",
                "phone": "(555) 555-6666",
                "license_number": "RE345678",
                "rating": 5.0,
                "years_experience": 12,
                "is_active": True
            },
            {
                "email": "alex.rivera@realty.com",
                "username": "alexrivera",
                "hashed_password": get_password_hash("agent123"),
                "full_name": "Alex Rivera",
                "phone": "(555) 777-8888",
                "license_number": "RE901234",
                "rating": 4.6,
                "years_experience": 3,
                "is_active": True
            },
            {
                "email": "lisa.park@realty.com",
                "username": "lisapark",
                "hashed_password": get_password_hash("agent123"),
                "full_name": "Lisa Park",
                "phone": "(555) 999-0000",
                "license_number": "RE567890",
                "rating": 4.7,
                "years_experience": 7,
                "is_active": True
            },
            {
                "email": "david.kim@realty.com",
                "username": "davidkim",
                "hashed_password": get_password_hash("agent123"),
                "full_name": "David Kim",
                "phone": "(555) 222-3333",
                "license_number": "RE678901",
                "rating": 4.9,
                "years_experience": 10,
                "is_active": True
            }
        ]
        
        for agent_data in agents_data:
            # Check if agent already exists
            existing_agent = db.query(Agent).filter(Agent.email == agent_data["email"]).first()
            if not existing_agent:
                agent = Agent(**agent_data)
                db.add(agent)
        
        db.commit()
        
        # Get agents for house assignment
        agents = db.query(Agent).all()
        
        # Create sample houses
        houses_data = [
            {
                "title": "Modern Downtown Apartment",
                "description": "Beautiful modern apartment in the heart of downtown with stunning city views and premium amenities.",
                "address": "123 Main St, Downtown",
                "city": "New York",
                "state": "NY",
                "zip_code": "10001",
                "price": 2500,
                "bedrooms": 2,
                "bathrooms": 2,
                "sqft": 1200,
                "property_type": "apartment",
                "latitude": 40.7589,
                "longitude": -73.9851,
                "amenities": "Gym, Pool, Parking, Concierge",
                "images": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
                "is_available": True,
                "agent_id": agents[0].id if agents else None
            },
            {
                "title": "Cozy Suburban House",
                "description": "Charming 3-bedroom house in a quiet suburban neighborhood, perfect for families.",
                "address": "456 Oak Ave, Suburbia",
                "city": "Queens",
                "state": "NY", 
                "zip_code": "11375",
                "price": 3200,
                "bedrooms": 3,
                "bathrooms": 2.5,
                "sqft": 1800,
                "property_type": "house",
                "latitude": 40.7282,
                "longitude": -73.7949,
                "amenities": "Garden, Garage, Fireplace, Near Schools",
                "images": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
                "is_available": True,
                "agent_id": agents[1].id if agents else None
            },
            {
                "title": "Luxury Penthouse",
                "description": "Stunning penthouse with panoramic city views, premium finishes, and exclusive amenities.",
                "address": "789 Sky Tower, Uptown",
                "city": "Manhattan",
                "state": "NY",
                "zip_code": "10025",
                "price": 5500,
                "bedrooms": 3,
                "bathrooms": 3,
                "sqft": 2200,
                "property_type": "condo",
                "latitude": 40.7831,
                "longitude": -73.9712,
                "amenities": "Concierge, Rooftop, Gym, Spa",
                "images": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
                "is_available": True,
                "agent_id": agents[2].id if agents else None
            },
            {
                "title": "Studio Loft",
                "description": "Trendy studio loft in the creative district with high ceilings and artistic flair.",
                "address": "321 Art District, Creative Quarter",
                "city": "Brooklyn",
                "state": "NY",
                "zip_code": "11201",
                "price": 1800,
                "bedrooms": 1,
                "bathrooms": 1,
                "sqft": 800,
                "property_type": "studio",
                "latitude": 40.7505,
                "longitude": -73.9934,
                "amenities": "High Ceilings, Exposed Brick, Natural Light",
                "images": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
                "is_available": True,
                "agent_id": agents[3].id if agents else None
            },
            {
                "title": "Family Townhouse",
                "description": "Spacious 4-bedroom townhouse in a family-friendly neighborhood with excellent schools.",
                "address": "654 Family Lane, Quiet Neighborhood",
                "city": "Staten Island",
                "state": "NY",
                "zip_code": "10314",
                "price": 2800,
                "bedrooms": 4,
                "bathrooms": 3,
                "sqft": 2000,
                "property_type": "townhouse",
                "latitude": 40.6892,
                "longitude": -74.0445,
                "amenities": "Backyard, Garage, Near Schools, Playground",
                "images": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
                "is_available": True,
                "agent_id": agents[4].id if agents else None
            },
            {
                "title": "Waterfront Condo",
                "description": "Beautiful waterfront condo with marina access and breathtaking water views.",
                "address": "987 Harbor View, Marina District",
                "city": "Jersey City",
                "state": "NJ",
                "zip_code": "07302",
                "price": 4200,
                "bedrooms": 2,
                "bathrooms": 2,
                "sqft": 1400,
                "property_type": "condo",
                "latitude": 40.7061,
                "longitude": -74.0087,
                "amenities": "Water View, Balcony, Marina Access, Pool",
                "images": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
                "is_available": True,
                "agent_id": agents[5].id if agents else None
            }
        ]
        
        for house_data in houses_data:
            # Check if house already exists
            existing_house = db.query(House).filter(House.address == house_data["address"]).first()
            if not existing_house:
                house = House(**house_data)
                db.add(house)
        
        db.commit()
        print("Sample data created successfully!")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data()

