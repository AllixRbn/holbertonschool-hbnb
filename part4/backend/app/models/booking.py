#!/usr/bin/python3

from app import db
from app.models.base import BaseModel


class Booking(BaseModel):
    __tablename__ = 'bookings'

    place_id = db.Column(
        db.String(36), db.ForeignKey('places.id'), nullable=False)
    user_id = db.Column(
        db.String(36), db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')
    # Notification flags
    owner_seen = db.Column(db.Boolean, default=False)
    guest_seen = db.Column(db.Boolean, default=True)

    place = db.relationship(
        'Place',
        backref=db.backref('bookings', cascade='all, delete-orphan'))
    user = db.relationship(
        'User',
        backref=db.backref('booking_requests', cascade='all, delete-orphan'))

    def __init__(self, place_id, user_id, date):
        self.place_id = place_id
        self.user_id = user_id
        self.date = date
        self.status = 'pending'
        self.owner_seen = False
        self.guest_seen = True
