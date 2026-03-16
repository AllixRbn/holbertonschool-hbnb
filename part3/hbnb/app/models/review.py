#!/usr/bin/python3

from app import db
from app.models.base import BaseModel
from app.models.place import Place
from app.models.user import User


class Review(BaseModel):
    __tablename__ = 'reviews'

    text = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Integer, nullable=False)

    def __init__(self, text: str, rating: int, place: Place = None, user: User = None):
        super().__init__()

        if not text or not text.strip():
            raise ValueError("Review text is required")
        if not (1 <= rating <= 5):
            raise ValueError("Rating must be between 1 and 5")

        self.text = text
        self.rating = rating

        # Temporary Python-side links until SQLAlchemy relationships are added later
        self.place = place
        self.user = user
