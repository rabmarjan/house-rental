from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.database.database import get_db
from app.models.house import House
from app.models.agent import Agent
from app.schemas.house import HouseCreate, HouseUpdate, HouseResponse, HouseSearch
from app.core.security import get_current_active_user

router = APIRouter(prefix="/houses", tags=["houses"])


@router.post("/", response_model=HouseResponse, status_code=status.HTTP_201_CREATED)
async def create_house(
    house: HouseCreate, 
    current_user = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    # Allow both agents and users to create properties
    # If user is not an agent, they can still create properties but need to specify an agent_id
    if hasattr(current_user, 'agent_id'):
        # User creating property - use their associated agent or specified agent
        agent_id = house.agent_id if house.agent_id else current_user.agent_id
    else:
        # Agent creating property - use their own ID
        agent_id = current_user.id if hasattr(current_user, 'id') else house.agent_id
    
    # Verify the agent exists
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agent not found"
        )
    
    # Create house with the determined agent_id
    house_data = house.dict()
    house_data['agent_id'] = agent_id
    
    db_house = House(**house_data)
    db.add(db_house)
    db.commit()
    db.refresh(db_house)
    return db_house


@router.get("/search", response_model=List[HouseResponse])
async def search_houses(
    city: str = Query(None),
    state: str = Query(None),
    min_price: float = Query(None),
    max_price: float = Query(None),
    min_bedrooms: int = Query(None),
    max_bedrooms: int = Query(None),
    min_bathrooms: float = Query(None),
    max_bathrooms: float = Query(None),
    property_type: str = Query(None),
    pet_policy: str = Query(None),
    parking: str = Query(None),
    available_only: bool = Query(True),
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    db: Session = Depends(get_db)
):
    query = db.query(House)
    
    # Apply filters
    if available_only:
        query = query.filter(House.is_available == True)
    
    if city:
        query = query.filter(House.city.ilike(f"%{city}%"))
    
    if state:
        query = query.filter(House.state.ilike(f"%{state}%"))
    
    if min_price is not None:
        query = query.filter(House.rent_price >= min_price)
    
    if max_price is not None:
        query = query.filter(House.rent_price <= max_price)
    
    if min_bedrooms is not None:
        query = query.filter(House.bedrooms >= min_bedrooms)
    
    if max_bedrooms is not None:
        query = query.filter(House.bedrooms <= max_bedrooms)
    
    if min_bathrooms is not None:
        query = query.filter(House.bathrooms >= min_bathrooms)
    
    if max_bathrooms is not None:
        query = query.filter(House.bathrooms <= max_bathrooms)
    
    if property_type:
        query = query.filter(House.property_type == property_type)
    
    if pet_policy:
        query = query.filter(House.pet_policy == pet_policy)
    
    if parking:
        query = query.filter(House.parking == parking)
    
    houses = query.offset(offset).limit(limit).all()
    return houses


@router.get("/{house_id}", response_model=HouseResponse)
async def read_house(house_id: int, db: Session = Depends(get_db)):
    db_house = db.query(House).filter(House.id == house_id).first()
    if db_house is None:
        raise HTTPException(status_code=404, detail="House not found")
    
    # Increment view count
    db_house.views_count += 1
    db.commit()
    
    return db_house


@router.put("/{house_id}", response_model=HouseResponse)
async def update_house(
    house_id: int,
    house_update: HouseUpdate,
    current_user: Agent = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not isinstance(current_user, Agent):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only agents can update house listings"
        )
    
    db_house = db.query(House).filter(House.id == house_id).first()
    if db_house is None:
        raise HTTPException(status_code=404, detail="House not found")
    
    # Verify agent owns this listing
    if db_house.agent_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own listings"
        )
    
    # Update house fields
    update_data = house_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_house, field, value)
    
    db.commit()
    db.refresh(db_house)
    return db_house


@router.delete("/{house_id}")
async def delete_house(
    house_id: int,
    current_user: Agent = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not isinstance(current_user, Agent):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only agents can delete house listings"
        )
    
    db_house = db.query(House).filter(House.id == house_id).first()
    if db_house is None:
        raise HTTPException(status_code=404, detail="House not found")
    
    # Verify agent owns this listing
    if db_house.agent_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own listings"
        )
    
    db.delete(db_house)
    db.commit()
    return {"message": "House listing deleted successfully"}


@router.get("/", response_model=List[HouseResponse])
async def read_houses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    houses = db.query(House).filter(House.is_available == True).offset(skip).limit(limit).all()
    return houses


@router.get("/agent/{agent_id}", response_model=List[HouseResponse])
async def read_houses_by_agent(agent_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    houses = db.query(House).filter(House.agent_id == agent_id).offset(skip).limit(limit).all()
    return houses

