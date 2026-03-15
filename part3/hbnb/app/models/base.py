#!/usr/bin/python3
from app import db
import uuid
from datetime import datetime


class BaseModel(db.Model):
    __abstract__ = True # This ensures SQLAlchemy does not create a table for BaseModel

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __init__(self):
        # use "private" attributes and expose them via properties for protection
        self._id = str(uuid.uuid4())
        self._created_at = datetime.now()
        self._updated_at = datetime.now()

    @property
    def id(self):
        """Read‑only unique identifier"""
        return self._id

    @property
    def created_at(self):
        """Timestamp when object was instantiated. Read only."""
        return self._created_at

    @property
    def updated_at(self):
        """Timestamp of last modification. Updated by :meth:`save`."""
        return self._updated_at

    def save(self):
        """Update the updated_at timestamp whenever the object is modified"""
        self._updated_at = datetime.now()

    def update(self, data):
        """Update the attributes of the object based on the provided dictionary.

        The method deliberately skips immutable fields (``id`` and
        ``created_at``) and relies on property setters for validation.
        """
        for key, value in data.items():
            # prevent overriding immutable attributes
            if key in ("id", "created_at"):
                continue
            if hasattr(self, key):
                setattr(self, key, value)
        self.save()  # Update the updated_at timestamp
