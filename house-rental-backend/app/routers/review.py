from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.database.database import get_db
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewRead, ReviewResponse
from app.core.security import get_current_active_user

router = APIRouter(prefix="/reviews", tags=["reviews"])

# Create a new review
@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    db_review = Review(
        agent_id=review.agent_id,
        author=review.author,
        rating=review.rating,
        date=review.date,
        comment=review.comment
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return ReviewResponse.from_orm(db_review)

# Get a review by ID
@router.get("/{review_id}", response_model=ReviewResponse)
def get_review(review_id: int, db: Session = Depends(get_db)):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if db_review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return ReviewResponse.from_orm(db_review)

# Get all reviews for an agent
@router.get("/agent/{agent_id}", response_model=List[ReviewResponse])
def get_reviews_by_agent(agent_id: int, db: Session = Depends(get_db)):
    db_reviews = db.query(Review).filter(Review.agent_id == agent_id).all()
    return [ReviewResponse.from_orm(r) for r in db_reviews]

# Update a review
@router.put("/{review_id}", response_model=ReviewResponse)
def update_review(review_id: int, review_update: ReviewCreate, db: Session = Depends(get_db)):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if db_review:
        db_review.author = review_update.author
        db_review.rating = review_update.rating
        db_review.date = review_update.date
        db_review.comment = review_update.comment
        db.commit()
        db.refresh(db_review)
        return ReviewResponse.from_orm(db_review)
    raise HTTPException(status_code=404, detail="Review not found")

# Delete a review
@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(review_id: int, db: Session = Depends(get_db)):
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if db_review:
        db.delete(db_review)
        db.commit()
        return
    raise HTTPException(status_code=404, detail="Review not found")