from sqlalchemy.orm import Session
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewRead

# Create a new review
def create_review(db: Session, review: ReviewCreate) -> Review:
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
    return db_review

# Get a review by ID
def get_review(db: Session, review_id: int) -> Review:
    return db.query(Review).filter(Review.id == review_id).first()

# Get all reviews for an agent
def get_reviews_by_agent(db: Session, agent_id: int):
    return db.query(Review).filter(Review.agent_id == agent_id).all()

# Update a review
def update_review(db: Session, review_id: int, review_update: ReviewCreate) -> Review:
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if db_review:
        db_review.author = review_update.author
        db_review.rating = review_update.rating
        db_review.date = review_update.date
        db_review.comment = review_update.comment
        db.commit()
        db.refresh(db_review)
    return db_review

# Delete a review
def delete_review(db: Session, review_id: int) -> bool:
    db_review = db.query(Review).filter(Review.id == review_id).first()
    if db_review:
        db.delete(db_review)
        db.commit()
        return True
    return False
