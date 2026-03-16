#!/usr/bin/python3

from app import db
from app.models.base import BaseModel
from app.models.user import User


class Place(BaseModel):
    __tablename__ = 'places'

    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    def __init__(self, title: str, description: str = None, price: float = 0.0,
                 latitude: float = 0.0, longitude: float = 0.0, owner: User = None):
        super().__init__()

        if not title or len(title) > 100:
            raise ValueError("Invalid title")
        if price <= 0:
            raise ValueError("Price must be positive")
        if not (-90.0 <= latitude <= 90.0):
            raise ValueError("Invalid latitude")
        if not (-180.0 <= longitude <= 180.0):
            raise ValueError("Invalid longitude")

        self.title = title
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude

        # Temporary Python-side links until SQLAlchemy relationships are added later
        self.owner = owner
        self.reviews = []
        self.amenities = []

    def add_review(self, review):
        self.reviews.append(review)

    def add_amenity(self, amenity):
        self.amenities.append(amenity)

    def clear_amenities(self):
        self.amenities.clear()
