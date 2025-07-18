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
                "is_active": True,
                "is_admin": True,
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
            }
        ]
        
        for agent_data in agents_data:
            existing_agent = db.query(Agent).filter(Agent.email == agent_data["email"]).first()
            if not existing_agent:
                agent = Agent(**agent_data)
                db.add(agent)
        
        db.commit()
        
        # # Get agents for house assignment
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
                "rent_price": 2500.0,
                "bedrooms": 2,
                "bathrooms": 2.0,
                "square_feet": 1200,
                "property_type": "apartment",
                "latitude": 40.7589,
                "longitude": -73.9851,
                "amenities": ["Gym", "Pool", "Parking", "Concierge"],
                "images": ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"],
                "is_available": True,
                "agent_id": agents[0].id if agents else 1
            },
            {
                "title": "Cozy Suburban House",
                "description": "Charming 3-bedroom house in a quiet suburban neighborhood, perfect for families.",
                "address": "456 Oak Ave, Suburbia",
                "city": "Queens",
                "state": "NY", 
                "zip_code": "11375",
                "rent_price": 3200.0,
                "bedrooms": 3,
                "bathrooms": 2.5,
                "square_feet": 1800,
                "property_type": "house",
                "latitude": 40.7282,
                "longitude": -73.7949,
                "amenities": ["Garden", "Garage", "Fireplace", "Near Schools"],
                "images": ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"],
                "is_available": True,
                "agent_id": agents[1].id if len(agents) > 1 else 1
            },
            {
                "title": "Luxury Penthouse",
                "description": "Stunning penthouse with panoramic city views, premium finishes, and exclusive amenities.",
                "address": "789 Sky Tower, Uptown",
                "city": "Manhattan",
                "state": "NY",
                "zip_code": "10025",
                "rent_price": 5500.0,
                "bedrooms": 3,
                "bathrooms": 3.0,
                "square_feet": 2200,
                "property_type": "condo",
                "latitude": 40.7831,
                "longitude": -73.9712,
                "amenities": ["Concierge", "Rooftop", "Gym", "Spa"],
                "images": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"],
                "is_available": True,
                "agent_id": agents[2].id if len(agents) > 2 else 1
            }
        ]
        
        for house_data in houses_data:
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

