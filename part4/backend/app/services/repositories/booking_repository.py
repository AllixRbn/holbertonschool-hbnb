from app.models.booking import Booking
from app.persistence.repository import SQLAlchemyRepository


class BookingRepository(SQLAlchemyRepository):
    def __init__(self):
        super().__init__(Booking)

    def get_by_place(self, place_id):
        return Booking.query.filter_by(place_id=place_id).all()

    def get_by_user(self, user_id):
        return Booking.query.filter_by(user_id=user_id).all()
