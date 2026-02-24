#!/usr/bin/python3

import re
from app.models.base_model import BaseModel


class User(BaseModel):

    existing_emails = set()

    def __init__(self, first_name, last_name, email, is_admin=False):
        super().__init__()

        if not first_name or len(first_name) > 50:
            raise ValueError("Invalid first name")

        if not last_name or len(last_name) > 50:
            raise ValueError("Invalid last name")

        if not self.validate_email(email):
            raise ValueError("Invalid email format")

        if email in User.existing_emails:
            raise ValueError("Email already exists")

        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.is_admin = is_admin

        self.places = []
        self.reviews = []

        User.existing_emails.add(email)

    @staticmethod
    def validate_email(email):
        pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        return re.match(pattern, email)
