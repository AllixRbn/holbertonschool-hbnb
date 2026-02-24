#!/usr/bin/python3
"""
Module handling communication between the Presentation, Business Logic,
and Persistence layers
"""


from app.persistence.repository import InMemoryRepository
from app.models.user import User
from app.models.place import Place
from app.models.review import Review
from app.models.amenity import Amenity



class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

    # Placeholder method for creating a user
    def create_user(self, user_data):
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email):
        return self.user_repo.get_by_attribute('email', email)

    def get_all_users(self):
        return self.user_repo.get_all()

    def update_user(self, user_id, new_data):
        user = self.get_user(user_id)
        if not user:
            return None

        if 'first_name' in new_data:
            user.first_name = new_data['first_name']
        if 'last_name' in new_data:
            user.last_name = new_data['last_name']
        if 'email' in new_data:
            user.email = new_data['email']

        self.user_repo.update(user_id, new_data)
        return user

    # Placeholder method for fetching a place by ID
    def get_place(self, place_id):
        # Logic will be implemented in later tasks
        pass

facade = HBnBFacade()
