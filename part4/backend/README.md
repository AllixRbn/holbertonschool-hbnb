# HBnB — Part 3

## Overview

HBnB is a simplified Airbnb-like application developed as part of the Holberton School curriculum.  
This third part extends the previous versions by introducing:

- **SQLAlchemy ORM persistence**
- **JWT authentication**
- **role-based access control**
- **entity relationships**
- **raw SQL scripts for schema generation and initial data**

This project follows a layered architecture with:

- a **Presentation layer** using Flask and Flask-RESTX
- a **Business Logic layer** using a Facade
- a **Persistence layer** using SQLAlchemy repositories

Swagger documentation is available at:

- `http://127.0.0.1:5000/`

---

## Project Structure

```text
part3/hbnb/
├── app/
│   ├── __init__.py
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── amenities.py
│   │       ├── auth.py
│   │       ├── places.py
│   │       ├── reviews.py
│   │       └── users.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── amenity.py
│   │   ├── association.py
│   │   ├── base.py
│   │   ├── place.py
│   │   ├── review.py
│   │   └── user.py
│   ├── persistence/
│   │   ├── __init__.py
│   │   └── repository.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── facade.py
│   │   └── repositories/
│   │       ├── __init__.py
│   │       ├── amenity_repository.py
│   │       ├── place_repository.py
│   │       ├── review_repository.py
│   │       └── user_repository.py
│   └── tests/
│       ├── curl_test.md
│       ├── list_datas.py
│       ├── test_admin_endpoints.sh
│       ├── test_amenities.py
│       ├── test_places.py
│       ├── test_reviews.py
│       ├── test_users.py
│       └── unittest.md
├── Database diagram/
│   └── Database Diagram.png
├── instance/
│   └── development.db
├── sql/
│   ├── schema.sql
│   └── enter_data.sql
├── config.py
├── README.md
├── requirements.txt
└── run.py
```

---

## Architecture

The application follows a **3-layer architecture**:

- **API layer**: handles HTTP requests and JSON responses
- **Facade layer**: centralizes business logic and orchestration
- **Repository layer**: handles persistence and database interactions

Flow:

```text
API → Facade → Repository → Database
```

This separation makes the project easier to maintain, test, and extend.

---

## Technologies Used

- **Python 3**
- **Flask**
- **Flask-RESTX**
- **Flask-Bcrypt**
- **Flask-JWT-Extended**
- **SQLAlchemy**
- **Flask-SQLAlchemy**
- **SQLite** for ORM development database
- **MySQL / MariaDB** for raw SQL scripts
- **email-validator**

---

## Two Database Approaches in This Project

This part contains **two different database approaches**:

### 1. ORM database (SQLAlchemy)
The Flask application uses **SQLAlchemy ORM** with the configuration:

- `sqlite:///development.db`

This is the database used when you run the Python application with:

```bash
python3 run.py
```

In this case, tables are created through the SQLAlchemy models and `db.create_all()`.

### 2. Raw SQL database
The project also contains raw SQL scripts:

- `sql/schema.sql`
- `sql/enter_data.sql`

These scripts are used to manually create the schema and insert initial data in a relational database such as **MySQL** or **MariaDB**.

### Important note
These two approaches are **separate**.

- The **ORM database** is managed through Python classes and SQLAlchemy
- The **SQL database** is managed through manual SQL scripts

They do **not automatically sync with each other**.

---

## Entity Relationship Diagram

The following diagram represents the database structure and relationships between the entities:

![Database Diagram](Database%20diagram/Database%20Diagram.png)

---

## Models and Relationships

### User
Fields:
- `id`
- `first_name`
- `last_name`
- `email`
- `password`
- `is_admin`
- `created_at`
- `updated_at`

Relationships:
- one user can own many places
- one user can write many reviews

### Place
Fields:
- `id`
- `title`
- `description`
- `price`
- `latitude`
- `longitude`
- `owner_id`
- `created_at`
- `updated_at`

Relationships:
- belongs to one user
- has many reviews
- has many amenities

### Review
Fields:
- `id`
- `text`
- `rating`
- `user_id`
- `place_id`
- `created_at`
- `updated_at`

Relationships:
- belongs to one user
- belongs to one place

### Amenity
Fields:
- `id`
- `name`
- `created_at`
- `updated_at`

Relationships:
- belongs to many places through the `place_amenity` association table

### Place_Amenity
Association table used for the many-to-many relationship between `Place` and `Amenity`.

---

## Business Rules and Validation

### User
- `first_name` and `last_name` are required and must not exceed 50 characters
- `email` must be valid and unique
- passwords are hashed with bcrypt

### Place
- `title` is required and must not exceed 100 characters
- `price` must be strictly positive
- `latitude` must be between `-90` and `90`
- `longitude` must be between `-180` and `180`

### Review
- `text` is required and must not be empty
- `rating` must be between `1` and `5`
- a user can only leave one review per place
- a user cannot review their own place

### Amenity
- `name` is required and must not exceed 50 characters

---

## Authentication and Authorization

Authentication is handled with **JWT**.

### Login
Route:

```http
POST /api/v1/auth/login
```

Example body:

```json
{
  "email": "admin@hbnb.io",
  "password": "admin1234"
}
```

Response:

```json
{
  "access_token": "<JWT_TOKEN>"
}
```

### Protected endpoints
Protected routes require the following header:

```http
Authorization: Bearer <JWT_TOKEN>
```

### Role-based access control
- regular users can only modify their own profile
- regular users can only update/delete their own reviews
- regular users can only update their own places
- admins can:
  - modify any user
  - create and update amenities
  - bypass ownership restrictions on places and reviews

---

## API Endpoints

All endpoints are prefixed with `/api/v1`.

### Authentication
- `POST /auth/login`
- `GET /auth/protected`

### Users
- `POST /users/`
- `GET /users/`
- `GET /users/<user_id>`
- `PUT /users/<user_id>`

### Places
- `POST /places/`
- `GET /places/`
- `GET /places/<place_id>`
- `PUT /places/<place_id>`
- `GET /places/<place_id>/reviews`
- `GET /places/<place_id>/amenities`
- `POST /places/<place_id>/amenities`

### Reviews
- `POST /reviews/`
- `GET /reviews/`
- `GET /reviews/<review_id>`
- `PUT /reviews/<review_id>`
- `DELETE /reviews/<review_id>`

### Amenities
- `POST /amenities/`
- `GET /amenities/`
- `GET /amenities/<amenity_id>`
- `PUT /amenities/<amenity_id>`

---

## Installation

### Prerequisites
- Python 3.8+
- pip

### Clone the repository

```bash
git clone https://github.com/LucasN-ux/holbertonschool-hbnb.git
cd holbertonschool-hbnb
```

### Create and activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

Dependencies used:

- `flask`
- `flask-restx`
- `flask-bcrypt`
- `flask-jwt-extended`
- `sqlalchemy`
- `flask-sqlalchemy`
- `email-validator`

---

## Configuration

The application uses `config.py` with:

- `SECRET_KEY`
- `DEBUG = True`
- `SQLALCHEMY_DATABASE_URI = sqlite:///development.db`
- `SQLALCHEMY_TRACK_MODIFICATIONS = False`

Default configuration:

- `development`

---

## Running the Flask Application

Start the project with:

```bash
python3 run.py
```

At startup, the application will:

- create the database tables with `db.create_all()`
- bootstrap an admin user if it does not already exist

Swagger UI will be available at:

- `http://127.0.0.1:5000/`

---

## Default Admin User

The project initializes an administrator account.

### Flask bootstrap admin
When the app starts, it creates an admin user if it does not exist:

- **Email**: `admin@example.com`
- **Password**: `admin123`

### SQL seed admin
The raw SQL seed script inserts a different admin user:

- **ID**: `36c9050e-ddd3-4c3b-9731-9f487208bbc1`
- **Email**: `admin@hbnb.io`
- **Password**: `admin1234` (stored as bcrypt hash)
- **is_admin**: `TRUE`

### Important note
These two admin users belong to the **two different database approaches** described earlier.

---

## SQL Scripts

Two SQL scripts are provided:

- `sql/schema.sql`
- `sql/enter_data.sql`

### `schema.sql`
Creates the full schema for:

- `users`
- `places`
- `reviews`
- `amenities`
- `place_amenity`

It includes:
- primary keys
- foreign keys
- unique constraints
- check constraints

### `enter_data.sql`
Inserts:
- one administrator user
- three initial amenities:
  - WiFi
  - Swimming Pool
  - Air Conditioning

---

## Running MySQL / MariaDB Scripts

### If MySQL is installed locally
You can run:

```bash
mysql -u root -p
```

Then:

```sql
CREATE DATABASE hbnb_db;
USE hbnb_db;
SOURCE sql/schema.sql;
SOURCE sql/enter_data.sql;
```

### Alternative from terminal
```bash
mysql -u root -p hbnb_db < sql/schema.sql
mysql -u root -p hbnb_db < sql/enter_data.sql
```

### If `mysql` is not found
On some environments such as:
- Codespaces
- VMs
- containers
- remote school sandboxes

you may need to install MySQL or MariaDB first.

For example on Ubuntu:

```bash
sudo apt update
sudo apt install mysql-server -y
```

or:

```bash
sudo apt install mariadb-server -y
```

Then start the service:

```bash
sudo service mysql start
```

or:

```bash
sudo service mariadb start
```

### Important note
The exact command to launch MySQL can vary depending on the environment:
- local machine
- virtual machine
- Codespace
- school sandbox

---

## Example API Requests

### Create a user

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/users/" \
-H "Content-Type: application/json" \
-d '{
  "first_name": "Alice",
  "last_name": "User",
  "email": "alice@example.com",
  "password": "password123"
}'
```

### Login

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/auth/login" \
-H "Content-Type: application/json" \
-d '{
  "email": "admin@example.com",
  "password": "admin123"
}'
```

### Create an amenity as admin

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/amenities/" \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "name": "Parking"
}'
```

### Create a place

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/places/" \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "title": "Cozy Apartment",
  "description": "City center apartment",
  "price": 100,
  "latitude": 43.3,
  "longitude": -0.37,
  "amenities": []
}'
```

### Create a review

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/reviews/" \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "text": "Great place",
  "rating": 5,
  "place_id": "<PLACE_ID>"
}'
```

---

## Notes

- the project now contains both ORM-based persistence and raw SQL scripts
- SQLite is used for the Flask development database
- raw SQL scripts are provided independently for schema generation and initial data

---

## Authors

Lucas Nevano  
Allix Robin
