#!/usr/bin/python3

from app.models.base import BaseModel


class Amenity(BaseModel):
    def __init__(self, name: str):
        super().__init__()
        # assignment goes through setter for validation
        self.name = name

    @property
    def name(self):
        """Amenity name (max 50 chars)."""
        return self._name

    @name.setter
    def name(self, value: str):
        if not value or len(value) > 50:
            raise ValueError("Invalid amenity name")
        self._name = value
