from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.agent_stats import AgentStatsResponse
from app.crud.agent_stats import get_agent_stats, create_agent_stats, update_agent_stats, delete_agent_stats

router = APIRouter(prefix="/agent-stats", tags=["agent-stats"])

@router.get(
    "/{agent_id}",
    response_model=AgentStatsResponse,
    summary="Get agent stats",
    description="Retrieve statistics for a specific agent by agent_id."
)
def read_agent_stats(agent_id: int, db: Session = Depends(get_db)):
    stats = get_agent_stats(db, agent_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Agent stats not found")
    return stats

@router.post(
    "/{agent_id}",
    response_model=AgentStatsResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create agent stats",
    description="Create statistics for a specific agent by agent_id."
)
def create_stats(agent_id: int, stats: AgentStatsResponse, db: Session = Depends(get_db)):
    db_stats = create_agent_stats(db, agent_id, stats.dict(exclude_unset=True))
    return db_stats

@router.put(
    "/{agent_id}",
    response_model=AgentStatsResponse,
    summary="Update agent stats",
    description="Update statistics for a specific agent by agent_id."
)
def update_stats(agent_id: int, stats: AgentStatsResponse, db: Session = Depends(get_db)):
    db_stats = update_agent_stats(db, agent_id, stats.dict(exclude_unset=True))
    if not db_stats:
        raise HTTPException(status_code=404, detail="Agent stats not found")
    return db_stats

@router.delete(
    "/{agent_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete agent stats",
    description="Delete statistics for a specific agent by agent_id."
)
def delete_stats(agent_id: int, db: Session = Depends(get_db)):
    deleted = delete_agent_stats(db, agent_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Agent stats not found")
    return
