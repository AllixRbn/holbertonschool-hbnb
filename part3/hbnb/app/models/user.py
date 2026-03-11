#!/usr/bin/python3

import re
from app.models.base import BaseModel
from app import bcrypt


class User(BaseModel):

    existing_emails = set()

    def __init__(self, first_name, last_name, email, is_admin=False):
        super().__init__()
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.is_admin = is_admin
        self._password = None

        # collections are read-only via properties
        self._places = []
        self._reviews = []

    @property
    def first_name(self):
        return self._first_name

    @first_name.setter
    def first_name(self, value: str):
        if not value or len(value) > 50:
            raise ValueError("Invalid first name")
        self._first_name = value

    @property
    def last_name(self):
        return self._last_name

    @last_name.setter
    def last_name(self, value: str):
        if not value or len(value) > 50:
            raise ValueError("Invalid last name")
        self._last_name = value

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, value: str):
        if not self.validate_email(value):
            raise ValueError("Invalid email format")
        # uniqueness check
        if value in User.existing_emails and getattr(self, "_email", None) != value:
            raise ValueError("Email already exists")
        # update global registry
        old = getattr(self, "_email", None)
        if old:
            User.existing_emails.discard(old)
        self._email = value
        User.existing_emails.add(value)

    @property
    def is_admin(self):
        return self._is_admin

    @is_admin.setter
    def is_admin(self, value: bool):
        self._is_admin = bool(value)

    @property
    def places(self):
        return list(self._places)

    @property
    def reviews(self):
        return list(self._reviews)

    @staticmethod
    def validate_email(email):
        pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        return re.match(pattern, email)

    @property
    def hash_password(self):
        raise AttributeError("Password is not readable")

    @hash_password.setter
    def hash_password(self, password):
        """Hashes the password before storing it."""
        self._password = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        """Verifies if the provided password matches the hashed password."""
        return bcrypt.check_password_hash(self._password, password)
