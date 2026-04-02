/* ================================================
   HBnB Frontend - scripts.js
   Handles: Login, Places List, Place Details,
            Add Review
   ================================================ */

const API_URL = 'http://127.0.0.1:5000';

/* ------------------------------------------------
   Utility: read a cookie value by name
   ------------------------------------------------ */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/* ------------------------------------------------
   Utility: extract ?id=xxx from the current URL
   ------------------------------------------------ */
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/* ------------------------------------------------
   Utility: escape HTML to prevent XSS
   ------------------------------------------------ */
function escapeHTML(str) {
    if (typeof str !== 'string') return str ?? '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* ================================================
   LOGIN PAGE
   ================================================ */

function setupLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    /* Listen for form submission */
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        await loginUser(email, password);
    });
}

/* POST credentials to API, store JWT in cookie on success */
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            /* Store JWT token in cookie, accessible site-wide */
            document.cookie = `token=${data.access_token}; path=/`;
            window.location.href = 'index.html';
        } else {
            const err = await response.json().catch(() => ({}));
            alert('Login failed: ' + (err.error || response.statusText));
        }
    } catch (error) {
        alert('Cannot reach the API. Please ensure the server is running.');
    }
}

/* ================================================
   INDEX PAGE  –  List of Places
   ================================================ */

function setupIndexPage() {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    /* Wire up the price filter (populated in HTML; event here) */
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', (event) => {
            const maxPrice = event.target.value;
            const cards = document.querySelectorAll('.place-card');

            cards.forEach((card) => {
                if (maxPrice === 'all') {
                    card.style.display = 'flex';
                } else {
                    const price = parseFloat(card.dataset.price);
                    /* Show card if price is unknown or within limit */
                    card.style.display =
                        (isNaN(price) || price <= parseFloat(maxPrice)) ? 'flex' : 'none';
                }
            });
        });
    }

    checkAuthAndFetchPlaces();
}

/* Show/hide login link based on JWT presence, then fetch places */
function checkAuthAndFetchPlaces() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (loginLink) {
        /* Hide "Login" link when user is already authenticated */
        loginLink.style.display = token ? 'none' : 'block';
    }

    /* Places endpoint is public; token included if available for future-proofing */
    fetchPlaces(token);
}

/* Fetch all places then enrich each with its price via detail endpoint */
async function fetchPlaces(token) {
    const placesList = document.getElementById('places-list');

    try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(`${API_URL}/api/v1/places/`, { headers });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const places = await response.json();

        /*
         * The list endpoint does not include price.
         * Fetch each place's detail in parallel to obtain it.
         */
        const detailed = await Promise.all(
            places.map(async (place) => {
                try {
                    const dr = await fetch(`${API_URL}/api/v1/places/${place.id}`, { headers });
                    if (dr.ok) return await dr.json();
                } catch (_) { /* ignore individual failures, fall back to list data */ }
                return place;
            })
        );

        displayPlaces(detailed);

    } catch (error) {
        placesList.innerHTML =
            '<p class="no-places">Unable to load places. Please ensure the API server is running.</p>';
    }
}

/* Render place cards into #places-list */
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    if (!places || places.length === 0) {
        placesList.innerHTML = '<p class="no-places">No places found.</p>';
        return;
    }

    places.forEach((place) => {
        const price = place.price !== undefined ? place.price : null;

        const card = document.createElement('div');
        card.classList.add('place-card');
        /* Store price as data attribute for client-side filtering */
        card.dataset.price = price !== null ? price : '';

        card.innerHTML = `
            <h3>${escapeHTML(place.title)}</h3>
            <p class="price">${price !== null ? `$${price} / night` : 'Price unavailable'}</p>
            <a href="place.html?id=${encodeURIComponent(place.id)}" class="details-button">View Details</a>
        `;

        placesList.appendChild(card);
    });
}

/* ================================================
   PLACE DETAILS PAGE
   ================================================ */

function setupPlacePage() {
    const placeId = getPlaceIdFromURL();

    /* Redirect to home if no place ID in URL */
    if (!placeId) {
        window.location.href = 'index.html';
        return;
    }

    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
    const addReviewSection = document.getElementById('add-review');

    /* Show/hide login link */
    if (loginLink) loginLink.style.display = token ? 'none' : 'block';

    /* Show add-review form only for authenticated users */
    if (addReviewSection) {
        addReviewSection.style.display = token ? 'block' : 'none';
    }

    /* Fetch and render place details + reviews */
    fetchPlaceDetails(token, placeId);

    /* Wire up inline review form (only when authenticated) */
    const reviewForm = document.getElementById('review-form');
    if (reviewForm && token) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const reviewText = document.getElementById('review-text').value.trim();
            const rating = parseInt(document.getElementById('rating').value, 10);

            if (!reviewText || !rating) {
                alert('Please fill in all fields.');
                return;
            }

            const res = await submitReview(token, placeId, reviewText, rating);
            if (res.ok) {
                alert('Review submitted successfully!');
                reviewForm.reset();
                /* Refresh the reviews list */
                fetchReviews(placeId);
            } else {
                alert('Failed to submit review. Please try again.');
            }
        });
    }
}

/* GET /api/v1/places/<id> and render the result */
async function fetchPlaceDetails(token, placeId) {
    const detailsSection = document.getElementById('place-details');

    try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_URL}/api/v1/places/${placeId}`, { headers });

        if (response.status === 404) {
            detailsSection.innerHTML = '<p>Place not found.</p>';
            return;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const place = await response.json();
        displayPlaceDetails(place);
        fetchReviews(placeId);

    } catch (error) {
        detailsSection.innerHTML =
            '<p>Unable to load place details. Please ensure the API server is running.</p>';
    }
}

/* Render full place info into .place-details section */
function displayPlaceDetails(place) {
    const section = document.getElementById('place-details');
    if (!section) return;

    const ownerName = place.owner
        ? `${escapeHTML(place.owner.first_name)} ${escapeHTML(place.owner.last_name)}`
        : 'Unknown';

    const amenitiesHTML = place.amenities && place.amenities.length > 0
        ? place.amenities.map((a) => `<span class="amenity-tag">${escapeHTML(a.name)}</span>`).join('')
        : '<span>No amenities listed</span>';

    section.innerHTML = `
        <h1>${escapeHTML(place.title)}</h1>
        <div class="place-info">
            <p><strong>Host:</strong> ${ownerName}</p>
            <p><strong>Price:</strong> $${place.price !== undefined ? place.price : 'N/A'} / night</p>
            <p><strong>Latitude:</strong> ${place.latitude}</p>
            <p><strong>Longitude:</strong> ${place.longitude}</p>
        </div>
        <p class="place-description">
            <strong>Description:</strong> ${escapeHTML(place.description || 'No description provided.')}
        </p>
        <div class="amenities-list">
            <strong>Amenities:</strong>&nbsp;${amenitiesHTML}
        </div>
    `;
}

/* GET /api/v1/places/<id>/reviews and render each as a review-card */
async function fetchReviews(placeId) {
    const reviewsSection = document.getElementById('reviews');
    if (!reviewsSection) return;

    try {
        const response = await fetch(`${API_URL}/api/v1/places/${placeId}/reviews`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const reviews = await response.json();
        displayReviews(reviews, reviewsSection);

    } catch (_) {
        reviewsSection.innerHTML = '<h2>Reviews</h2><p>Unable to load reviews.</p>';
    }
}

/* Render review cards */
function displayReviews(reviews, container) {
    container.innerHTML = '<h2>Reviews</h2>';

    if (!reviews || reviews.length === 0) {
        container.innerHTML += '<p>No reviews yet. Be the first to review this place!</p>';
        return;
    }

    reviews.forEach((review) => {
        const card = document.createElement('div');
        card.classList.add('review-card');

        const filled = '&#9733;'.repeat(review.rating);
        const empty  = '&#9734;'.repeat(5 - review.rating);

        card.innerHTML = `
            <div class="review-header">
                <span class="review-rating">${filled}${empty} (${review.rating}/5)</span>
            </div>
            <p>${escapeHTML(review.text)}</p>
        `;
        container.appendChild(card);
    });
}

/* ================================================
   ADD REVIEW PAGE  (add_review.html)
   ================================================ */

function setupAddReviewPage() {
    /* Redirect unauthenticated users immediately */
    const token = getCookie('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const placeId = getPlaceIdFromURL();
    if (!placeId) {
        window.location.href = 'index.html';
        return;
    }

    /* Show the place title above the form */
    loadPlaceName(placeId, token);

    const reviewForm = document.getElementById('review-form');
    if (!reviewForm) return;

    reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const reviewText = document.getElementById('review').value.trim();
        const rating = parseInt(document.getElementById('rating').value, 10);

        if (!reviewText || !rating) {
            alert('Please fill in all fields.');
            return;
        }

        const response = await submitReview(token, placeId, reviewText, rating);
        handleReviewResponse(response, reviewForm, placeId);
    });
}

/* Fetch place name and display it as context above the form */
async function loadPlaceName(placeId, token) {
    try {
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_URL}/api/v1/places/${placeId}`, { headers });
        if (response.ok) {
            const place = await response.json();
            const display = document.getElementById('place-name-display');
            if (display) display.textContent = `Reviewing: ${place.title}`;
        }
    } catch (_) { /* non-critical, ignore */ }
}

/* POST a new review to the API */
async function submitReview(token, placeId, reviewText, rating) {
    return fetch(`${API_URL}/api/v1/reviews/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            text: reviewText,
            rating: rating,
            place_id: placeId
        })
    });
}

/* Show result feedback, clear form, redirect back to the place */
async function handleReviewResponse(response, form, placeId) {
    if (response.ok) {
        alert('Review submitted successfully!');
        form.reset();
        window.location.href = `place.html?id=${encodeURIComponent(placeId)}`;
    } else {
        const err = await response.json().catch(() => ({}));
        alert('Failed to submit review: ' + (err.error || response.statusText));
    }
}

/* ================================================
   ROUTER  –  detect current page and run setup
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.includes('login.html')) {
        setupLoginPage();
    } else if (path.includes('place.html')) {
        setupPlacePage();
    } else if (path.includes('add_review.html')) {
        setupAddReviewPage();
    } else {
        /* Default: index page (index.html or /) */
        setupIndexPage();
    }
});
