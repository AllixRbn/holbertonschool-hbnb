# HBnB — Part 4

## Overview

HBnB is a simplified Airbnb-like application developed as part of the Holberton School curriculum.  
This fourth part extends the previous versions by introducing a **full web client** that connects to the existing REST API.

New in this part:

- **HTML/CSS/JavaScript frontend** — no framework, no library
- **JWT-based authentication** handled entirely in the browser via cookies
- **Dynamic rendering** — all content is fetched from the API and injected into the DOM
- **User registration** — new accounts can be created directly from the interface
- **Review system** — authenticated users can submit reviews from the place detail page or a dedicated page
- **Price filter** — places can be filtered by maximum price per night
- **Light / dark mode** — persisted across pages via localStorage
- **Mock data fallback** — the frontend degrades gracefully when the API is unreachable
- **Database seeder** — a bash script populates the database entirely through the API

The backend is identical to Part 3 and retains its full layered architecture with Flask, SQLAlchemy, and JWT.

Swagger documentation is available at:

- `http://127.0.0.1:5000/`

---

## Project Structure

```text
part4/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── amenities.py
│   │   │       ├── auth.py
│   │   │       ├── places.py
│   │   │       ├── reviews.py
│   │   │       └── users.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── amenity.py
│   │   │   ├── association.py
│   │   │   ├── base.py
│   │   │   ├── place.py
│   │   │   ├── review.py
│   │   │   └── user.py
│   │   ├── persistence/
│   │   │   ├── __init__.py
│   │   │   └── repository.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── facade.py
│   │   │   └── repositories/
│   │   │       ├── __init__.py
│   │   │       ├── amenity_repository.py
│   │   │       ├── place_repository.py
│   │   │       ├── review_repository.py
│   │   │       └── user_repository.py
│   │   └── tests/
│   │       ├── list_datas.py
│   │       ├── test_amenities.py
│   │       ├── test_places.py
│   │       ├── test_reviews.py
│   │       └── test_users.py
│   ├── instance/
│   │   └── development.db
│   ├── sql/
│   │   ├── schema.sql
│   │   └── enter_data.sql
│   ├── config.py
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── images/
│   │   ├── logo.svg
│   │   └── icon.svg
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── place.html
│   ├── add_review.html
│   ├── styles.css
│   ├── scripts.js
│   └── petals.js
└── seed.sh
```

---

## Architecture

### Backend

The backend follows a **3-layer architecture** inherited from Part 3:

- **API layer**: handles HTTP requests and JSON responses (Flask-RESTX)
- **Facade layer**: centralizes business logic and orchestration
- **Repository layer**: handles persistence and database interactions (SQLAlchemy)

```text
API → Facade → Repository → Database
```

### Frontend

The frontend is a **static web client** built with vanilla HTML, CSS, and JavaScript only.  
It communicates with the backend exclusively through `fetch()` calls to the REST API.

```text
Browser → fetch() → Flask API → SQLite
```

Authentication tokens are stored in cookies and read on every page load to determine the user's session state.

---

## Technologies Used

### Backend
- **Python 3**
- **Flask**
- **Flask-RESTX**
- **Flask-Bcrypt**
- **Flask-JWT-Extended**
- **SQLAlchemy**
- **Flask-SQLAlchemy**
- **SQLite**
- **email-validator**

### Frontend
- **HTML5**
- **CSS3** — custom properties, glassmorphism, keyframe animations, responsive layout
- **Vanilla JavaScript ES6** — fetch API, DOM manipulation, cookie handling
- **Google Fonts** — Cormorant Garamond, Inter

---

## Frontend Pages

### `index.html` — Home
- Displays all available places fetched from the API
- Pill-based price filter synced to a hidden select element
- Falls back to mock data with a toast notification if the API is unreachable
- Requires no authentication to browse

### `login.html` — Sign in
- Email and password form
- On success, stores the JWT token as a cookie and redirects to the home page
- Links to the registration page

### `register.html` — Create account
- First name, last name, email, password, and password confirmation
- Validates that passwords match and meet the minimum length
- On success, automatically logs the user in and redirects to the home page

### `place.html` — Place details
- Fetches and displays the full details of a place including description, price, owner, amenities, and reviews
- Shows a review form at the bottom only when the user is authenticated

### `add_review.html` — Add a review
- Dedicated review submission page linked from the place detail page
- Requires authentication — unauthenticated users are redirected to the home page
- Supports both a star rating widget and a numeric select fallback

---

## Frontend Features

### Authentication flow
- JWT token stored in `document.cookie` with `path=/`
- On every page load, the token is read and used to show or hide the login/logout button
- Logout expires the cookie immediately and redirects to the home page

### Dark mode
- Toggled by the 🌸 button in the navigation bar
- Theme preference is persisted in `localStorage`
- Applied via a `data-theme="dark"` attribute on the `<html>` element

### Sakura petal animation
- Animated petals fall across the background on all pages
- Implemented in `petals.js` as a self-contained IIFE
- Controlled by CSS keyframes

### Mock data fallback
- If the backend is not reachable, the frontend displays a predefined set of 6 places with reviews
- A toast notification informs the user that live data could not be loaded
- Mock place IDs are prefixed with `mock-` to prevent unnecessary API calls

### Toast notifications
- Used for login success, errors, review submission, and mock data fallback
- Auto-dismiss after 3.5 seconds

---

## Database Seeder

`seed.sh` is a bash script that populates the database entirely through the API without touching any backend files.

It creates:
- **6 host users** (Yuki, Emma, Kenji, Sophie, Hana, Luca)
- **4 guest reviewer users** (Marie, Thomas, Aiko, James)
- **22 amenities** (WiFi, Private Garden, Tea Room, Hot Tub, Spa Access, etc.)
- **6 places**, each created while logged in as the respective owner
- **24 reviews**, with guests reviewing places they did not own

The script is idempotent: users and amenities that already exist are skipped gracefully.

```bash
bash part4/seed.sh
```

The backend must be running before executing the seeder.

---

## Models and Relationships

### User
Fields: `id`, `first_name`, `last_name`, `email`, `password`, `is_admin`, `created_at`, `updated_at`

Relationships:
- one user can own many places
- one user can write many reviews

### Place
Fields: `id`, `title`, `description`, `price`, `latitude`, `longitude`, `owner_id`, `created_at`, `updated_at`

Relationships:
- belongs to one user
- has many reviews
- has many amenities (via association table)

### Review
Fields: `id`, `text`, `rating`, `user_id`, `place_id`, `created_at`, `updated_at`

Relationships:
- belongs to one user
- belongs to one place

### Amenity
Fields: `id`, `name`, `created_at`, `updated_at`

Relationships:
- belongs to many places through the `place_amenity` association table

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

Authentication is handled with **JWT** (Flask-JWT-Extended).

### Login

```http
POST /api/v1/auth/login
```

Body:

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Response:

```json
{
  "access_token": "<JWT_TOKEN>"
}
```

### Protected endpoints

Protected routes require:

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
- A modern web browser

### Clone the repository

```bash
git clone https://github.com/LucasN-ux/holbertonschool-hbnb.git
cd holbertonschool-hbnb
```

### Install backend dependencies

```bash
cd part4/backend
pip install -r requirements.txt
```

Dependencies:

- `flask`
- `flask-restx`
- `flask-bcrypt`
- `flask-jwt-extended`
- `flask-cors`
- `sqlalchemy`
- `flask-sqlalchemy`
- `email-validator`

---

## Configuration

The backend uses `config.py` with:

- `SECRET_KEY` — read from environment variable, falls back to `default_secret_key`
- `DEBUG = True`
- `SQLALCHEMY_DATABASE_URI = sqlite:///development.db`
- `SQLALCHEMY_TRACK_MODIFICATIONS = False`

### CORS

The backend allows cross-origin requests only from:

- `http://localhost:5500`
- `http://127.0.0.1:5500`

The frontend must be served on port **5500** for the API calls to work.

---

## Running the Project

### Step 1 — Start the backend

```bash
cd part4/backend
python3 run.py
```

At startup, the application will:
- create the database tables via `db.create_all()`
- bootstrap an admin user if one does not already exist

Swagger UI will be available at `http://127.0.0.1:5000/`.

### Step 2 — Seed the database (first run only)

```bash
bash part4/seed.sh
```

This populates the database with 6 places, 22 amenities, and 24 reviews via the API.  
The backend must be running before executing this script.

### Step 3 — Serve the frontend

```bash
cd part4/frontend
python3 -m http.server 5500
```

Then open `http://127.0.0.1:5500` in your browser.

---

## Default Admin User

When the backend starts for the first time, it automatically creates an admin account:

- **Email**: `admin@example.com`
- **Password**: `admin123`

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

### Create an amenity (admin only)

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/amenities/" \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "name": "Rooftop Terrace"
}'
```

### Create a place

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/places/" \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "title": "Sakura Villa",
  "description": "A serene garden suite with heated tatami floors.",
  "price": 80,
  "latitude": 35.011636,
  "longitude": 135.768029,
  "amenities": []
}'
```

### Submit a review

```bash
curl -X POST "http://127.0.0.1:5000/api/v1/reviews/" \
-H "Authorization: Bearer <TOKEN>" \
-H "Content-Type: application/json" \
-d '{
  "text": "An unforgettable stay.",
  "rating": 5,
  "place_id": "<PLACE_ID>"
}'
```

---

## Authors

Lucas Nevano — backend  
Allix Robin — backend & frontend
