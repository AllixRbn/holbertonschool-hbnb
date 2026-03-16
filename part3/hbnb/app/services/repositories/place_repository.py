from app.models.place import Place
from app.services.repositories.base import BaseRepository
from app import db

class PlaceRepository(BaseRepository):
    def __init__(self):
        super().__init__(Place)
