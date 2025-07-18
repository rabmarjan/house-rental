from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.config import settings
from app.database.database import get_db
from app.models.user import User
from app.models.agent import Agent
from app.schemas.token import TokenData

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        user_type: str = payload.get("user_type")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username, user_type=user_type)
    except JWTError:
        raise credentials_exception
    return token_data


def get_current_user(token_data: TokenData = Depends(verify_token), db: Session = Depends(get_db)):
    if token_data.user_type == "user":
        user = db.query(User).filter(User.username == token_data.username).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
        return user
    elif token_data.user_type == "agent":
        agent = db.query(Agent).filter(Agent.username == token_data.username).first()
        if agent is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
        return agent
    
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user type",
        )


def get_current_active_user(current_user: Union[User, Agent] = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user



def get_current_agent(token_data: TokenData = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current agent from token, ensuring the user is an agent"""
    if token_data.user_type != "agent":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Agent privileges required.",
        )
    
    agent = db.query(Agent).filter(Agent.username == token_data.username).first()
    if agent is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    if not agent.is_active:
        raise HTTPException(status_code=400, detail="Inactive agent")
    
    return agent


def get_current_active_agent(current_agent: Agent = Depends(get_current_agent)):
    """Get current active agent"""
    return current_agent



def get_current_admin(token_data: TokenData = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current admin user from token, ensuring the user has admin privileges"""
    if token_data.user_type != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required.",
        )
    
    user = db.query(User).filter(User.username == token_data.username).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
  #  For now, we'll assume all users can be admins. In a real app, you'd check for admin role
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Admin privileges required.",
        )
    
    return user

