# HBnB — Part 4

> A full-stack Airbnb-inspired web application built with a Flask REST API and a vanilla JS frontend, developed as part of the Holberton School curriculum.

---

## Getting Started

### Prerequisites

Make sure the following are installed on your machine before anything else:

- **Python 3.8+** — check with `python3 --version`
- **pip** — check with `pip --version`
- **Git** — check with `git --version`
- A modern web browser (Chrome, Firefox, Edge…)

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/AllixRbn/holbertonschool-hbnb.git
cd holbertonschool-hbnb
```

---

### Step 2 — Install backend dependencies

```bash
cd part4/backend
pip install -r requirements.txt
```

This installs Flask, Flask-RESTX, Flask-JWT-Extended, Flask-Bcrypt, Flask-CORS, Flask-SQLAlchemy, and email-validator.

---

### Step 3 — Start the backend

While still on the path part4/backend, you will start the app with the following command : 

```bash
python run.py
```

You should see:

```
* Running on http://127.0.0.1:5000
```

Leave this terminal open. The backend must stay running for the frontend to work.

> On first launch, the app automatically creates the SQLite database and an admin user. The database is already included in the repository so all data is ready immediately.

---

### Step 4 — Serve the frontend

Open a **second terminal**, then:

```bash
cd part4/frontend
python3 -m http.server 5500
```

---

### Step 5 — Open the app

Go to **http://127.0.0.1:5500** in your browser.

The API's Swagger documentation is available at **http://127.0.0.1:5000**.

---

### Default admin account

| Email | Password |
|---|---|
| `admin@example.com` | `admin123` |

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Features](#features)
3. [Pages](#pages)
4. [API Reference](#api-reference)
5. [Models](#models)
6. [Project Structure](#project-structure)
7. [Configuration](#configuration)
8. [Authors](#authors)

---

## Features

### For everyone
- Browse all listed places with live stats (place count, review count, average rating)
- Filter places by **city** and **max price per night**
- View full place details — description, amenities, location, owner, reviews
- **Light / dark mode** toggled by the 🌸 button, persisted in `localStorage`
- Graceful fallback to mock data when the API is unreachable

### For registered users
- **Create an account** with GDPR consent at registration
- **List a place** — title, city, price, description, coordinates, image URL, amenities
- **Delete your place** from its detail page or your profile
- **Write and delete reviews** on places you've visited
- **Request a booking** for a specific date on any place you don't own
- **Receive notifications** when a booking is approved or denied
- **Public profiles** — click any host or reviewer name to view their profile
- **Delete your account** — places removed, reviews anonymised as "Deleted User"

### For place owners
- **Manage incoming booking requests** — approve or deny from your profile
- **Notification badge** on the nav bar when a new booking request arrives

### For admins
- Full access to delete any place or review
- **Admin panel** on the profile page to create new amenities

### Legal & privacy
- Cookie consent banner (GDPR-compliant, choice stored in `localStorage`)
- Full [Privacy Policy](frontend/privacy.html) and [Terms of Service](frontend/terms.html) pages

---

## Pages

| Page | URL | Auth required |
|---|---|---|
| Home | `index.html` | No |
| Sign in | `login.html` | No |
| Register | `register.html` | No |
| Place details | `place.html?id=<id>` | No (review & booking need auth) |
| Add review | `add_review.html?id=<id>` | Yes |
| Add place | `add_place.html` | Yes |
| My account / public profile | `profile.html` / `profile.html?id=<id>` | Own profile needs auth |
| Privacy Policy | `privacy.html` | No |
| Terms of Service | `terms.html` | No |

### Profile page behaviour

- **Own profile** (`profile.html` with no `?id` or your own id) — shows stats, notifications, booking requests, booking history, places, reviews, delete account button. Admin users also see the amenity creation panel.
- **Public profile** (`profile.html?id=<other_id>`) — shows the user's places and reviews only. No personal data, no actions.

---

## API Reference

All endpoints are prefixed with `/api/v1`.  
Protected routes require `Authorization: Bearer <JWT>`.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | No | Returns a JWT access token |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/users/` | No | Register a new user |
| GET | `/users/` | No | List all users |
| GET | `/users/<id>` | No | Get a user by ID |
| PUT | `/users/<id>` | Yes | Update own profile (admin: any user) |
| DELETE | `/users/<id>` | Yes | Soft-delete own account (admin: any) |

### Places

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/places/` | Yes | Create a place |
| GET | `/places/` | No | List all places (includes city, image_url, price) |
| GET | `/places/<id>` | No | Get place details |
| PUT | `/places/<id>` | Yes | Update a place (owner or admin) |
| DELETE | `/places/<id>` | Yes | Delete a place (owner or admin) |
| GET | `/places/<id>/reviews` | No | Get all reviews for a place |
| GET | `/places/<id>/amenities` | No | Get amenities for a place |
| POST | `/places/<id>/amenities` | Yes | Associate amenities with a place |

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/reviews/` | Yes | Submit a review |
| GET | `/reviews/` | No | List all reviews |
| GET | `/reviews/<id>` | No | Get a review |
| PUT | `/reviews/<id>` | Yes | Update a review (author or admin) |
| DELETE | `/reviews/<id>` | Yes | Delete a review (author or admin) |

### Amenities

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/amenities/` | Yes (admin) | Create an amenity |
| GET | `/amenities/` | No | List all amenities |
| GET | `/amenities/<id>` | No | Get an amenity |
| PUT | `/amenities/<id>` | Yes (admin) | Update an amenity |

### Bookings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/bookings/` | Yes | Request a booking for a place |
| GET | `/bookings/` | Yes | Get own booking requests + requests on own places |
| GET | `/bookings/notifications` | Yes | Get unread notifications (owner & guest) |
| PUT | `/bookings/<id>` | Yes | Approve or deny a request (place owner or admin) |
| PUT | `/bookings/<id>/seen` | Yes | Mark a notification as seen |

---

## Models

### User
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `first_name` | String(50) | Required |
| `last_name` | String(50) | Required |
| `email` | String(120) | Required, unique |
| `password` | String(128) | Bcrypt-hashed |
| `is_admin` | Boolean | Default false |
| `is_deleted` | Boolean | Soft-delete flag |

### Place
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `title` | String(100) | Required |
| `description` | String(255) | Optional |
| `price` | Float | Must be > 0 |
| `latitude` | Float | −90 to 90 |
| `longitude` | Float | −180 to 180 |
| `city` | String(100) | Optional |
| `image_url` | String(500) | Optional |
| `owner_id` | FK → User | |

### Review
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `text` | String | Required, non-empty |
| `rating` | Integer | 1 to 5 |
| `user_id` | FK → User | |
| `place_id` | FK → Place | |

### Booking
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `place_id` | FK → Place | |
| `user_id` | FK → User | |
| `date` | String | YYYY-MM-DD |
| `status` | String | `pending` / `approved` / `denied` |
| `owner_seen` | Boolean | Notification flag for owner |
| `guest_seen` | Boolean | Notification flag for guest |

### Amenity
| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | String(50) | Required |

**Relationships:** User → many Places · User → many Reviews · Place → many Reviews · Place ↔ many Amenities (via `place_amenity` association table) · User → many Bookings · Place → many Bookings

---

## Project Structure

```
part4/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App factory, CORS, JWT, namespace registration
│   │   ├── api/v1/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── places.py
│   │   │   ├── reviews.py
│   │   │   ├── amenities.py
│   │   │   └── bookings.py      # Booking + notification endpoints
│   │   ├── models/
│   │   │   ├── base.py          # UUID primary key, timestamps
│   │   │   ├── user.py
│   │   │   ├── place.py
│   │   │   ├── review.py
│   │   │   ├── amenity.py
│   │   │   ├── booking.py
│   │   │   └── association.py   # Place ↔ Amenity join table
│   │   ├── services/
│   │   │   ├── facade.py        # All business logic
│   │   │   └── repositories/    # One repo per model
│   │   └── persistence/
│   │       └── repository.py    # SQLAlchemyRepository base class
│   ├── config.py
│   ├── requirements.txt
│   └── run.py                   # Entry point — creates tables, bootstraps admin
├── frontend/
│   ├── index.html               # Home — place listing + filters
│   ├── login.html
│   ├── register.html            # Includes GDPR consent checkbox
│   ├── place.html               # Place detail + booking form + reviews
│   ├── add_place.html           # Authenticated place creation form
│   ├── add_review.html          # Standalone review page
│   ├── profile.html             # Own profile + public profile
│   ├── privacy.html             # GDPR Privacy Policy
│   ├── terms.html               # Terms of Service
│   ├── styles.css               # Full theme, responsive layout, components
│   ├── scripts.js               # All frontend logic (router, API calls, UI)
│   ├── petals.js                # Sakura petal background animation
│   └── images/
│       ├── logo.svg
│       └── icon.svg
└── seed.sh                      # Populates DB via the API (idempotent)
```

---

## Configuration

**`config.py`**

| Key | Value |
|---|---|
| `SECRET_KEY` | Env var `SECRET_KEY`, falls back to `default_secret_key` |
| `DEBUG` | `True` |
| `SQLALCHEMY_DATABASE_URI` | `sqlite:///development.db` |

**CORS** — the backend only accepts requests from `http://localhost:5500` and `http://127.0.0.1:5500`. The frontend **must** be served on port `5500`.

**Frontend API base URL** — set at the top of `scripts.js`:
```js
const API_URL = 'http://127.0.0.1:5000';
```

### Resetting the database

If you change any model (schema change), drop and reseed:

```bash
pkill -f "python run.py"
rm part4/backend/instance/development.db
cd part4/backend && python run.py &
# wait for "Running on http://127.0.0.1:5000"
cd /path/to/holbertonschool-hbnb && bash part4/seed.sh
```

---

## Architecture

```
Browser
  └── fetch() calls
        └── Flask-RESTX (API layer)
              └── HBnBFacade (business logic)
                    └── SQLAlchemy Repositories
                          └── SQLite database
```

The frontend is a **static client** — no framework, no build step. All pages share `scripts.js`, which acts as a router based on `window.location.pathname`.

JWT tokens are decoded client-side (`atob(token.split('.')[1])`) to read `sub` (user ID) and `is_admin` without an extra API call.

---

## Authors

**Lucas Nevano** — backend architecture  
**Allix Robin** — backend & frontend
