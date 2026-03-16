from app.models.review import Review
from app.services.repositories.base import BaseRepository
from app import db

class AmenityRepository(BaseRepository):
    def __init__(self):
        super().__init__(Amenity)
