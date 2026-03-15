#!/usr/bin/python3
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from app import create_app, db
from app.models.user import User

# Crée l'application Flask et active le contexte
app = create_app()
with app.app_context():
    # Récupère tous les users
    users = User.query.all()

    # Affiche-les
    for u in users:
        print(f"ID: {u.id}, Name: {u.first_name} {u.last_name}, Email: {u.email}, Admin: {u.is_admin}")
