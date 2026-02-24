#!/usr/bin/python3

from app.models.base_model import BaseModel
from app.models.user import User


class Place(BaseModel):
    def __init__(self, title: str, description: str, price: float,
                 latitude: float, longitude: float, owner: User):
        super().__init__()

        if not title or len(title) > 100:
            raise ValueError("Invalid title")

        if price <= 0:
            raise ValueError("Price must be positive")

        if not (-90.0 <= latitude <= 90.0):
            raise ValueError("Invalid latitude")

        if not (-180.0 <= longitude <= 180.0):
            raise ValueError("Invalid longitude")

        if not isinstance(owner, User):
            raise ValueError("Owner must be a User instance")

        self.title = title
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude
        self.owner = owner

        self.reviews = []
        self.amenities = []

        owner.places.append(self)

    def add_review(self, review):
        self.reviews.append(review)

    def add_amenity(self, amenity):
        self.amenities.append(amenity)
