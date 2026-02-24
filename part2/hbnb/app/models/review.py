#!/usr/bin/python3

from app.models.base import BaseModel
from app.models.place import Place
from app.models.user import User


class Review(BaseModel):
    def __init__(self, text: str, rating: int, place: Place, user: User):
        super().__init__()

        if not text:
            raise ValueError("Review text is required")

        if not (1 <= rating <= 5):
            raise ValueError("Rating must be between 1 and 5")

        if not isinstance(place, Place):
            raise ValueError("Place must be a Place instance")

        if not isinstance(user, User):
            raise ValueError("User must be a User instance")

        self.text = text
        self.rating = rating
        self.place = place
        self.user = user

        place.reviews.append(self)
        user.reviews.append(self)
