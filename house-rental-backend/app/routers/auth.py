from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.agent import Agent
from app.schemas.token import Token
from app.schemas.user import UserLogin
from app.schemas.agent import AgentLogin
from app.core.security import verify_password, create_access_token
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["authentication"])


def authenticate_user(db: Session, username: str, password: str):
    # Try to find user by username first, then by email
    user = db.query(User).filter(User.username == username).first()
    if not user:
        user = db.query(User).filter(User.email == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def authenticate_agent(db: Session, username: str, password: str):
    # Try to find agent by username first, then by email
    agent = db.query(Agent).filter(Agent.username == username).first()
    if not agent:
        agent = db.query(Agent).filter(Agent.email == username).first()
    if not agent:
        return False
    if not verify_password(password, agent.hashed_password):
        return False
    return agent


@router.post("/user/login", response_model=Token)
async def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_type": "user"}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/agent/login", response_model=Token)
async def login_agent(agent_credentials: AgentLogin, db: Session = Depends(get_db)):
    agent = authenticate_agent(db, agent_credentials.username, agent_credentials.password)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": agent.username, "user_type": "agent"}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

