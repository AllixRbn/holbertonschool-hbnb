# HBnB — Project Setup and Package Initialization (Part 2)

## Overview
This part sets up a clean and modular foundation for the HBnB application using a layered architecture:

- **Presentation layer**: Flask-RESTx API endpoints (`app/api/`)
- **Business logic layer**: core models (`app/models/`) and orchestration through a **Facade** (`app/services/`)
- **Persistence layer**: an **in-memory repository** (`app/persistence/`) that will later be replaced by a database-backed solution with SQLAlchemy

At this stage, the application runs but API routes and business logic methods are still placeholders.

---

## Project Structure

hbnb/
├── app/
│ ├── init.py
│ ├── api/
│ │ ├── init.py
│ │ └── v1/
│ │ ├── init.py
│ │ ├── users.py
│ │ ├── places.py
│ │ ├── reviews.py
│ │ └── amenities.py
│ ├── models/
│ │ ├── init.py
│ │ ├── user.py
│ │ ├── place.py
│ │ ├── review.py
│ │ └── amenity.py
│ ├── services/
│ │ ├── init.py
│ │ └── facade.py
│ └── persistence/
│ ├── init.py
│ └── repository.py
├── run.py
├── config.py
├── requirements.txt
└── README.md


### What each folder/file is for

#### `app/`
Main application package.

- `app/__init__.py`
  - Creates the Flask application using an **application factory** (`create_app()`).
  - Initializes Flask-RESTx and Swagger documentation at `/api/v1/`.
  - Namespaces will be registered later.

#### `app/api/`
Presentation layer (HTTP API).

- `app/api/v1/`
  - Versioned API structure.
  - Placeholder modules (`users.py`, `places.py`, `reviews.py`, `amenities.py`)

#### `app/models/`
Business logic models.

- Placeholder classes and modules for:
  - `user.py`, `place.py`, `review.py`, `amenity.py`
- Full logic will be implemented later.

#### `app/services/`
Service layer that implements the **Facade pattern**.

- `facade.py`
  - Defines `HBnBFacade`, which centralizes interactions between:
    - API layer (presentation)
    - Models (business logic)
    - Repository (persistence)
  - Contains placeholder methods for now.
- `services/__init__.py`
  - Creates a single shared instance of the facade which acts like a singleton for the app.

#### `app/persistence/`
Persistence layer (storage abstraction).

- `repository.py`
  - Defines a `Repository` interface (abstract base class).
  - Implements an `InMemoryRepository` used during Part 2.
  - This will be replaced with a SQLAlchemy repository later without changing higher layers.

#### Root files

- `run.py`
  - Entry point to start the Flask application.

- `config.py`
  - Basic configuration setup.
  - Will be expanded in later parts.

- `requirements.txt`
  - Dependencies for this part:
    - `flask`
    - `flask-restx`

---

## Installation

From the `hbnb/` directory:

```bash
pip install -r requirements.txt
Running the Application
From the hbnb/ directory:

python run.py
You should see Flask running locally. Swagger documentation is available at:

http://127.0.0.1:5000/api/v1/

At this stage, no functional routes are implemented yet—this confirms the project structure and initialization are correct.

Notes / Next Steps
API namespaces and endpoints will be implemented in upcoming tasks.

Business models will be fully defined later.

The in-memory repository will be replaced by SQLAlchemy persistence in Part 3.

The Facade will later contain full logic for creating and retrieving users, places, reviews, and amenities.

::contentReference[oaicite:0]{index=0}