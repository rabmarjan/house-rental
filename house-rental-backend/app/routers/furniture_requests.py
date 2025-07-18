from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.furniture_request import FurnitureRequest
from app.models.user import User
from app.schemas.furniture_request import FurnitureRequestCreate, FurnitureRequestUpdate, FurnitureRequestResponse
from app.core.security import get_current_active_user

router = APIRouter(prefix="/furniture-requests", tags=["furniture-requests"])


@router.post("/", response_model=FurnitureRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_furniture_request(
    request: FurnitureRequestCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not isinstance(current_user, User):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users can create furniture moving requests"
        )
    
    # Verify user is creating request for themselves
    if request.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create requests for yourself"
        )
    
    db_request = FurnitureRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


@router.get("/my-requests", response_model=List[FurnitureRequestResponse])
async def read_my_furniture_requests(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not isinstance(current_user, User):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users can access furniture moving requests"
        )
    
    requests = db.query(FurnitureRequest).filter(
        FurnitureRequest.user_id == current_user.id
    ).all()
    return requests


@router.get("/{request_id}", response_model=FurnitureRequestResponse)
async def read_furniture_request(
    request_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not isinstance(current_user, User):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users can access furniture moving requests"
        )
    
    db_request = db.query(FurnitureRequest).filter(FurnitureRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Furniture request not found")
    
    # Verify user owns this request
    if db_request.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own requests"
        )
    
    return db_request


@router.put("/{request_id}", response_model=FurnitureRequestResponse)
async def update_furniture_request(
    request_id: int,
    request_update: FurnitureRequestUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not isinstance(current_user, User):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users can update furniture moving requests"
        )
    
    db_request = db.query(FurnitureRequest).filter(FurnitureRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Furniture request not found")
    
    # Verify user owns this request
    if db_request.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own requests"
        )
    
    # Update request fields
    update_data = request_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_request, field, value)
    
    db.commit()
    db.refresh(db_request)
    return db_request


@router.delete("/{request_id}")
async def delete_furniture_request(
    request_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    if not isinstance(current_user, User):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only users can delete furniture moving requests"
        )
    
    db_request = db.query(FurnitureRequest).filter(FurnitureRequest.id == request_id).first()
    if db_request is None:
        raise HTTPException(status_code=404, detail="Furniture request not found")
    
    # Verify user owns this request
    if db_request.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own requests"
        )
    
    db.delete(db_request)
    db.commit()
    return {"message": "Furniture request deleted successfully"}


# Admin endpoint to view all requests (for furniture moving companies)
@router.get("/", response_model=List[FurnitureRequestResponse])
async def read_all_furniture_requests(
    skip: int = 0, 
    limit: int = 100, 
    status: str = None,
    db: Session = Depends(get_db)
):
    query = db.query(FurnitureRequest)
    
    if status:
        query = query.filter(FurnitureRequest.status == status)
    
    requests = query.offset(skip).limit(limit).all()
    return requests

