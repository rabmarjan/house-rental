from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.database.database import get_db
from app.models.agent import Agent
from app.schemas.agent import AgentCreate, AgentUpdate, AgentResponse
from app.core.security import get_password_hash, get_current_active_user

router = APIRouter(prefix="/agents", tags=["agents"])


@router.post("/", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent(agent: AgentCreate, db: Session = Depends(get_db)):
    # Check if agent already exists
    db_agent = db.query(Agent).filter(
        (Agent.email == agent.email) | 
        (Agent.username == agent.username) | 
        (Agent.license_number == agent.license_number)
    ).first()
    if db_agent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email, username, or license number already registered"
        )
    
    # Create new agent
    hashed_password = get_password_hash(agent.password)
    db_agent = Agent(
        email=agent.email,
        username=agent.username,
        full_name=agent.full_name,
        phone=agent.phone,
        license_number=agent.license_number,
        company=agent.company,
        specialties=agent.specialties,
        bio=agent.bio,
        years_experience=agent.years_experience,
        service_areas=agent.service_areas,
        hashed_password=hashed_password
    )
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent


@router.get("/me", response_model=AgentResponse)
async def read_agent_me(current_user: Agent = Depends(get_current_active_user)):
    if not isinstance(current_user, Agent):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access agent endpoints"
        )
    return current_user


@router.put("/me", response_model=AgentResponse)
async def update_agent_me(
    agent_update: AgentUpdate,
    current_user: Agent = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not isinstance(current_user, Agent):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access agent endpoints"
        )
    
    # Update agent fields
    update_data = agent_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/{agent_id}", response_model=AgentResponse)
async def read_agent(agent_id: int, db: Session = Depends(get_db)):
    db_agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return db_agent


@router.get("/", response_model=List[AgentResponse])
async def read_agents(
    skip: int = 0, 
    limit: int = 100, 
    city: str = None,
    specialty: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(Agent)
    
    if city:
        query = query.filter(Agent.service_areas.contains([city]))
    
    if specialty:
        query = query.filter(Agent.specialties.contains([specialty]))
    
    agents = query.offset(skip).limit(limit).all()
    return agents


# @router.get("/{agent_id}", response_model=AgentResponse)
# async def read_agent(agent_id: int, db: Session = Depends(get_db)):
#     db_agent = db.query(Agent).options(joinedload(Agent.stats)).filter(Agent.id == agent_id).first()
#     if db_agent is None:
#         raise HTTPException(status_code=404, detail="Agent not found")
#     return db_agent



# @router.get("/", response_model=List[AgentResponse])
# async def read_agents(
#     skip: int = 0, 
#     limit: int = 100, 
#     city: str = None,
#     specialty: str = None,
#     db: Session = Depends(get_db)
# ):
#     query = db.query(Agent).options(joinedload(Agent.stats))
    
#     if city:
#         query = query.filter(Agent.service_areas.contains([city]))
    
#     if specialty:
#         query = query.filter(Agent.specialties.contains([specialty]))
    
#     agents = query.offset(skip).limit(limit).all()
#     return agents

