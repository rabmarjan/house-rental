from sqlalchemy.orm import Session
from app.models.agent import AgentStats
from app.schemas.agent_stats import AgentStatsResponse

def get_agent_stats(db: Session, agent_id: int):
    return db.query(AgentStats).filter(AgentStats.agent_id == agent_id).first()

def create_agent_stats(db: Session, agent_id: int, stats_data: dict):
    stats = AgentStats(agent_id=agent_id, **stats_data)
    db.add(stats)
    db.commit()
    db.refresh(stats)
    return stats

def update_agent_stats(db: Session, agent_id: int, stats_data: dict):
    stats = db.query(AgentStats).filter(AgentStats.agent_id == agent_id).first()
    if not stats:
        return None
    for key, value in stats_data.items():
        setattr(stats, key, value)
    db.commit()
    db.refresh(stats)
    return stats

def delete_agent_stats(db: Session, agent_id: int):
    stats = db.query(AgentStats).filter(AgentStats.agent_id == agent_id).first()
    if stats:
        db.delete(stats)
        db.commit()
        return True
    return False
