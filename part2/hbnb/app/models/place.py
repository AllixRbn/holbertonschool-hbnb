#!/usr/bin/python3

from app.models.base import BaseModel
from app.models.user import User


class Place(BaseModel):
    def __init__(self, title: str, description: str, price: float,
                 latitude: float, longitude: float, owner: User):
        super().__init__()
        # use property setters which perform validation and wiring
        self.title = title
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude
        self.owner = owner

        # collections are read‑only via properties; initialise private storage
        self._reviews = []
        self._amenities = []

    # simple scalar and reference attributes follow same pattern
    @property
    def title(self):
        return self._title

    @title.setter
    def title(self, value: str):
        if not value or len(value) > 100:
            raise ValueError("Invalid title")
        self._title = value

    @property
    def description(self):
        return self._description

    @description.setter
    def description(self, value: str):
        # no length restriction in original code
        self._description = value

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value: float):
        if value <= 0:
            raise ValueError("Price must be positive")
        self._price = value

    @property
    def latitude(self):
        return self._latitude

    @latitude.setter
    def latitude(self, value: float):
        if not (-90.0 <= value <= 90.0):
            raise ValueError("Invalid latitude")
        self._latitude = value

    @property
    def longitude(self):
        return self._longitude

    @longitude.setter
    def longitude(self, value: float):
        if not (-180.0 <= value <= 180.0):
            raise ValueError("Invalid longitude")
        self._longitude = value

    @property
    def owner(self):
        return self._owner

    @owner.setter
    def owner(self, value: User):
        if not isinstance(value, User):
            raise ValueError("Owner must be a User instance")
        # detach from previous owner if reassigning
        old = getattr(self, "_owner", None)
        if old and self in old._places:
            old._places.remove(self)
        self._owner = value
        if self not in value._places:
            value._places.append(self)

    @property
    def reviews(self):
        # return a copy to prevent external mutations
        return list(self._reviews)

    def add_review(self, review):
        self._reviews.append(review)

    @property
    def amenities(self):
        return list(self._amenities)

    def add_amenity(self, amenity):
        self._amenities.append(amenity)
