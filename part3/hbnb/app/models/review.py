#!/usr/bin/python3

from app.models.base import BaseModel
from app.models.place import Place
from app.models.user import User


class Review(BaseModel):
    def __init__(self, text: str, rating: int, place: Place, user: User):
        super().__init__()
        self.text = text
        self.rating = rating
        self.place = place
        self.user = user

    @property
    def text(self):
        return self._text

    @text.setter
    def text(self, value: str):
        if not value:
            raise ValueError("Review text is required")
        self._text = value

    @property
    def rating(self):
        return self._rating

    @rating.setter
    def rating(self, value: int):
        if not (1 <= value <= 5):
            raise ValueError("Rating must be between 1 and 5")
        self._rating = value

    @property
    def place(self):
        return self._place

    @place.setter
    def place(self, value: Place):
        if not isinstance(value, Place):
            raise ValueError("Place must be a Place instance")
        # detach from old place
        old = getattr(self, "_place", None)
        if old and self in old._reviews:
            old._reviews.remove(self)
        self._place = value
        if self not in value._reviews:
            value._reviews.append(self)

    @property
    def user(self):
        return self._user

    @user.setter
    def user(self, value: User):
        if not isinstance(value, User):
            raise ValueError("User must be a User instance")
        old = getattr(self, "_user", None)
        if old and self in old._reviews:
            old._reviews.remove(self)
        self._user = value
        if self not in value._reviews:
            value._reviews.append(self)
