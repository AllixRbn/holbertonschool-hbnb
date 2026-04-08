/* ================================================
   HBnB Frontend — scripts.js
   Handles: Login · Logout · Register · Places List ·
            Place Details · Add Review ·
            Toasts · Loading · Empty states · Star ratings
   ================================================ */

const API_URL = 'http://127.0.0.1:5000'; /* API_BASE_URL */

/* ================================================
   PLACE IMAGES
   Unsplash Source — free, no API key needed.
   Each URL maps to a place ID (mock or real fallback).
   ================================================ */
const PLACE_IMAGES = {
    'mock-1': 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop&q=80',
    'mock-2': 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    'mock-3': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80',
    'mock-4': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
    'mock-5': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80',
    'mock-6': 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&auto=format&fit=crop&q=80',
};

/* Title-based image fallback — used for real API places (IDs unknown at build time) */
const PLACE_IMAGES_BY_TITLE = {
    'Sakura Villa':       'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop&q=80',
    'The Blossom Loft':   'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
    'Fuji Retreat':       'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80',
    'Hanami Suite':       'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
    'Zen Garden Cottage': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80',
    'Momiji House':       'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=800&auto=format&fit=crop&q=80',
};

/* Gradient fallbacks matching CSS --g1…--g6 */
const CARD_GRADIENTS = [
    'linear-gradient(145deg,#FDDDE6 0%,#F4A4BE 50%,#E87FA0 100%)',
    'linear-gradient(145deg,#FDE8D8 0%,#F0C4A0 50%,#E8A87A 100%)',
    'linear-gradient(145deg,#D8EDF8 0%,#B8D4F0 50%,#8AAAE8 100%)',
    'linear-gradient(145deg,#E8F8E8 0%,#B8E4C4 50%,#80C8A0 100%)',
    'linear-gradient(145deg,#F8E8F8 0%,#E4B8E4 50%,#C88AC8 100%)',
    'linear-gradient(145deg,#FFF0D8 0%,#F0D8A0 50%,#D8B870 100%)',
];

/* Amenity icons map */
const AMENITY_ICONS = {
    'wifi':              '📶',
    'private garden':    '🌿',
    'heated floors':     '🔥',
    'tea room':          '🍵',
    'mountain view':     '⛰️',
    'rooftop terrace':   '🏙️',
    'espresso machine':  '☕',
    'city view':         '🌃',
    'fireplace':         '🪵',
    'hot tub':           '♨️',
    'forest trail':      '🌲',
    'bbq area':          '🍖',
    'concierge':         '🛎️',
    'breakfast':         '🥐',
    'spa access':        '🧖',
    'meditation garden': '🧘',
    'bicycle rental':    '🚲',
    'organic breakfast': '🥗',
    'tatami room':       '🏮',
    'sake bar':          '🍶',
    'outdoor bath':      '🛁',
    'koi pond':          '🐟',
};

function getAmenityIcon(name) {
    return AMENITY_ICONS[name.toLowerCase()] || '✦';
}

/* ================================================
   MOCK DATA
   Displayed when API is unreachable.
   Mirrors real API response shape exactly.
   ================================================ */
const MOCK_PLACES = [
    {
        id: 'mock-1',
        title: 'Sakura Villa',
        price: 80,
        description: 'A serene Kyoto-inspired garden suite with heated tatami floors, a private tea ceremony room, and sweeping mountain views. Lanterns line the stone path at dusk. Perfect for a slow, intentional retreat far from the noise of the city.',
        latitude: 35.011636,
        longitude: 135.768029,
        owner: { first_name: 'Yuki', last_name: 'Tanaka' },
        amenities: [
            { name: 'WiFi' }, { name: 'Private Garden' },
            { name: 'Heated Floors' }, { name: 'Tea Room' }, { name: 'Mountain View' }
        ]
    },
    {
        id: 'mock-2',
        title: 'The Blossom Loft',
        price: 95,
        description: 'A crisp, minimalist urban apartment with a rooftop terrace overlooking the city skyline. Clean lines, warm wood, and morning light that makes everything feel possible. Mornings here feel like a magazine shoot.',
        latitude: 35.689487,
        longitude: 139.691711,
        owner: { first_name: 'Emma', last_name: 'Chen' },
        amenities: [
            { name: 'WiFi' }, { name: 'Rooftop Terrace' },
            { name: 'Espresso Machine' }, { name: 'City View' }
        ]
    },
    {
        id: 'mock-3',
        title: 'Fuji Retreat',
        price: 60,
        description: 'A secluded cedar cabin at the foot of Mount Fuji. The forest is alive at night — fireflies in summer, snow at dawn in winter. Soak in the private hot tub while the mountain breathes around you.',
        latitude: 35.360627,
        longitude: 138.727363,
        owner: { first_name: 'Kenji', last_name: 'Mori' },
        amenities: [
            { name: 'WiFi' }, { name: 'Fireplace' },
            { name: 'Hot Tub' }, { name: 'Forest Trail' }, { name: 'BBQ Area' }
        ]
    },
    {
        id: 'mock-4',
        title: 'Hanami Suite',
        price: 110,
        description: 'A boutique hotel suite with floor-to-ceiling cherry blossom views, daily artisan breakfast, full spa access, and dedicated concierge service. The kind of place that recalibrates what luxury means.',
        latitude: 35.021041,
        longitude: 135.753441,
        owner: { first_name: 'Sophie', last_name: 'Laurent' },
        amenities: [
            { name: 'WiFi' }, { name: 'Concierge' },
            { name: 'Breakfast' }, { name: 'Spa Access' }
        ]
    },
    {
        id: 'mock-5',
        title: 'Zen Garden Cottage',
        price: 45,
        description: 'A peaceful countryside escape with a meditation garden, bicycle rental, and organic breakfasts served at sunrise. The silence here is productive. Deeply restorative — guests leave lighter than they arrived.',
        latitude: 34.693738,
        longitude: 135.502165,
        owner: { first_name: 'Hana', last_name: 'Watanabe' },
        amenities: [
            { name: 'WiFi' }, { name: 'Meditation Garden' },
            { name: 'Bicycle Rental' }, { name: 'Organic Breakfast' }
        ]
    },
    {
        id: 'mock-6',
        title: 'Momiji House',
        price: 75,
        description: 'A traditional-modern fusion home with a tatami lounge, curated sake bar, outdoor soaking bath, and a koi pond that glows amber at dusk. Every detail has been chosen with intention and care.',
        latitude: 34.385203,
        longitude: 132.455293,
        owner: { first_name: 'Luca', last_name: 'Rossi' },
        amenities: [
            { name: 'WiFi' }, { name: 'Tatami Room' },
            { name: 'Sake Bar' }, { name: 'Outdoor Bath' }, { name: 'Koi Pond' }
        ]
    }
];

const MOCK_REVIEWS = {
    'mock-1': [
        { text: 'One of the most peaceful places I have ever stayed. The tea ceremony room made our evenings truly special — we lingered for hours.', rating: 5, user: { first_name: 'Marie', last_name: 'D.' } },
        { text: 'The garden at sunrise is something I will carry with me for years. Heated floors were such a lovely touch in the early morning cold.', rating: 5, user: { first_name: 'Thomas', last_name: 'K.' } },
        { text: 'Beautifully designed, perfectly quiet, and close to nature in a way that feels rare now. Yuki was a warm and thoughtful host.', rating: 4, user: { first_name: 'Aiko', last_name: 'S.' } },
        { text: 'A bit remote but that is exactly the point. The mountain view from the bedroom is staggering. Worth every moment of the drive.', rating: 4, user: { first_name: 'James', last_name: 'L.' } }
    ],
    'mock-2': [
        { text: 'Sleek, stylish, and perfectly located. The rooftop terrace at sunset is worth the price alone — city lights and warm sake, perfect.', rating: 5, user: { first_name: 'Camille', last_name: 'B.' } },
        { text: 'Everything was immaculate. Emma responded within minutes whenever we had a question. The espresso machine was world-class.', rating: 5, user: { first_name: 'Noah', last_name: 'P.' } },
        { text: 'Great espresso and even better light in the morning. I barely left the apartment on day one and I regret nothing.', rating: 4, user: { first_name: 'Sara', last_name: 'M.' } }
    ],
    'mock-3': [
        { text: 'The hot tub under the stars with Fuji in the background is something I will never forget. One of those rare travel moments.', rating: 5, user: { first_name: 'Lucas', last_name: 'V.' } },
        { text: 'Cosy, quiet, and completely off-grid feeling. The fireplace made cold evenings magical. We never wanted to leave.', rating: 5, user: { first_name: 'Elena', last_name: 'R.' } },
        { text: 'Perfect escape from the city. The forest trail took us to a hidden waterfall on day two. Unbelievable find.', rating: 5, user: { first_name: 'David', last_name: 'T.' } },
        { text: 'Great for couples. Very private, very peaceful. The BBQ area was a wonderful bonus on the last evening.', rating: 4, user: { first_name: 'Yuna', last_name: 'O.' } },
        { text: 'Kenji left us detailed hand-drawn hiking maps with personal notes. Such a thoughtful, generous touch.', rating: 5, user: { first_name: 'Pierre', last_name: 'G.' } }
    ],
    'mock-4': [
        { text: 'The cherry blossom view from our bed was like sleeping inside a painting. We woke up early every morning just to see it.', rating: 5, user: { first_name: 'Isabella', last_name: 'F.' } },
        { text: 'Breakfast was exceptional — fresh, local, and beautifully presented each morning. The miso and seasonal fruits were extraordinary.', rating: 5, user: { first_name: 'Ethan', last_name: 'W.' } },
        { text: 'Spa access made this feel like a true luxury retreat. The onsen treatment on day two was transformative.', rating: 5, user: { first_name: 'Nadia', last_name: 'C.' } },
        { text: 'Concierge arranged a private garden tour we could not have found on our own. Hidden gem in the old quarter.', rating: 5, user: { first_name: 'Hugo', last_name: 'A.' } },
        { text: 'Slightly expensive but absolutely worth every yen. We felt genuinely taken care of for four full days.', rating: 4, user: { first_name: 'Mei', last_name: 'H.' } },
        { text: 'Flawless in every way. The finest accommodation I have had in Japan and I travel here twice a year.', rating: 5, user: { first_name: 'Oliver', last_name: 'N.' } }
    ],
    'mock-5': [
        { text: 'I arrived burnt out and left genuinely restored. The meditation garden did something quiet and profound to me.', rating: 5, user: { first_name: 'Clara', last_name: 'D.' } },
        { text: 'Organic breakfast at sunrise on the porch is the stuff of quiet dreams. Hana is one of the best hosts I have ever had.', rating: 5, user: { first_name: 'Ren', last_name: 'Y.' } }
    ],
    'mock-6': [
        { text: 'The outdoor bath by the koi pond at night is an experience unlike anything else. Silence, stars, warm water. Perfect.', rating: 5, user: { first_name: 'Giulia', last_name: 'M.' } },
        { text: 'Sake bar selection was surprisingly excellent. Luca clearly has a deep passion for Japanese rice wine. Great conversations.', rating: 5, user: { first_name: 'Ben', last_name: 'S.' } },
        { text: 'The tatami room was so comfortable — I slept better than I have in years. Something about it just works.', rating: 5, user: { first_name: 'Hana', last_name: 'K.' } },
        { text: 'A perfect blend of traditional and modern. Every detail was intentional. The koi pond glows amber at dusk — unforgettable.', rating: 4, user: { first_name: 'Max', last_name: 'B.' } }
    ]
};

/* ─────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────── */

/** Read a cookie value by name */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

/** Extract ?id=xxx from the current URL */
function getPlaceIdFromURL() {
    return new URLSearchParams(window.location.search).get('id');
}

/** Escape HTML to prevent XSS */
function escapeHTML(str) {
    if (typeof str !== 'string') return str ?? '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/** Render star glyphs */
function renderStars(rating) {
    const r = Math.round(Math.max(0, Math.min(5, rating)));
    return '★'.repeat(r) + '☆'.repeat(5 - r);
}

/** Get average rating from reviews array */
function avgRating(reviews) {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
}

/* ─────────────────────────────────────────────
   TOAST NOTIFICATIONS
   Replaces all alert() calls.
───────────────────────────────────────────── */
function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] ?? 'ℹ'}</span>
        <span class="toast-msg">${escapeHTML(message)}</span>`;

    container.appendChild(toast);
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('toast-show')));

    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/* ─────────────────────────────────────────────
   LOADING STATE
───────────────────────────────────────────── */
function showLoading(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="loading-state">
            <div class="spinner" aria-label="Loading"></div>
            <p>Loading…</p>
        </div>`;
}

/* ─────────────────────────────────────────────
   TOKEN DECODE — read JWT payload client-side
───────────────────────────────────────────── */
function decodeToken(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (_) { return null; }
}

/* ─────────────────────────────────────────────
   AUTH UI — sync login / logout visibility
───────────────────────────────────────────── */
function syncAuthUI(token) {
    const loginLink    = document.getElementById('login-link');
    const logoutBtn    = document.getElementById('logout-btn');
    const addPlaceLink = document.getElementById('add-place-link');
    const profileLink  = document.getElementById('profile-link');
    /* #login-link: required — show only when NOT authenticated */
    if (loginLink)    loginLink.style.display    = token ? 'none' : '';
    if (logoutBtn)    logoutBtn.style.display     = token ? ''     : 'none';
    if (addPlaceLink) addPlaceLink.style.display  = token ? ''     : 'none';
    if (profileLink)  profileLink.style.display   = token ? ''     : 'none';
    if (token && profileLink) checkNotificationBadge(token, profileLink);
}

async function checkNotificationBadge(token, linkEl) {
    try {
        const res = await fetch(`${API_URL}/api/v1/bookings/notifications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        const count = (data.guest || []).length + (data.owner || []).length;
        if (count > 0) {
            linkEl.innerHTML = `My Account <span class="notif-badge">${count}</span>`;
        }
    } catch (_) {}
}

/* ─────────────────────────────────────────────
   LOGOUT
───────────────────────────────────────────── */
function logout() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    showToast('You have been signed out.', 'info');
    setTimeout(() => { window.location.href = 'index.html'; }, 900);
}

function setupLogoutButton() {
    const btn = document.getElementById('logout-btn');
    if (btn) btn.addEventListener('click', logout);
}

function setupHamburger() {
    const hamburger = document.getElementById('hamburger-btn');
    const nav = document.querySelector('nav');
    if (!hamburger || !nav) return;

    function closeMenu() {
        nav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = nav.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    });
}

/* ─────────────────────────────────────────────
   REGISTER PAGE
───────────────────────────────────────────── */
function setupRegisterPage() {
    const form = document.getElementById('register-form');
    if (!form) return;

    syncAuthUI(getCookie('token'));
    setupLogoutButton();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const firstName = document.getElementById('first-name').value.trim();
        const lastName  = document.getElementById('last-name').value.trim();
        const email     = document.getElementById('email').value.trim();
        const password  = document.getElementById('password').value;
        const confirm   = document.getElementById('confirm-password').value;

        if (!firstName || !lastName || !email || !password) {
            showToast('Please fill in all fields.', 'error'); return;
        }
        if (password !== confirm) {
            showToast('Passwords do not match.', 'error'); return;
        }
        if (password.length < 6) {
            showToast('Password must be at least 6 characters.', 'error'); return;
        }

        await registerUser(firstName, lastName, email, password);
    });
}

async function registerUser(firstName, lastName, email, password) {
    try {
        const response = await fetch(`${API_URL}/api/v1/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name: firstName, last_name: lastName, email, password })
        });

        if (response.ok) {
            showToast('Account created! Signing you in…', 'success');
            await loginUser(email, password);
        } else {
            const err = await response.json().catch(() => ({}));
            showToast('Registration failed: ' + (err.error || response.statusText), 'error');
        }
    } catch (_) {
        showToast('Cannot reach the API. Please ensure the server is running.', 'error');
    }
}

/* ─────────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────────── */

/** Setup login form event listener */
function setupLoginPage() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    syncAuthUI(getCookie('token'));
    setupLogoutButton();

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email    = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        await loginUser(email, password);
    });
}

/** POST credentials → store JWT in cookie on success */
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            document.cookie = `token=${data.access_token}; path=/`;
            showToast('Welcome back! Redirecting…', 'success');
            setTimeout(() => { window.location.href = 'index.html'; }, 900);
        } else {
            const err = await response.json().catch(() => ({}));
            showToast('Sign in failed: ' + (err.error || response.statusText), 'error');
        }
    } catch (_) {
        showToast('Cannot reach the API. Please ensure the server is running.', 'error');
    }
}

/* ─────────────────────────────────────────────
   INDEX PAGE — List of Places
───────────────────────────────────────────── */
function setupIndexPage() {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    /* Price filter — required select, driven by pill buttons */
    const priceFilter = document.getElementById('price-filter');

    if (priceFilter) {
        priceFilter.addEventListener('change', () => applyFilters());
    }

    /* Price pill buttons */
    document.querySelectorAll('.filter-pill[data-value]').forEach((pill) => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.filter-pill[data-value]').forEach((p) => p.classList.remove('active'));
            pill.classList.add('active');
            if (priceFilter) {
                priceFilter.value = pill.dataset.value;
                priceFilter.dispatchEvent(new Event('change'));
            }
        });
    });

    /* City pill buttons */
    document.getElementById('city-pills')?.addEventListener('click', (e) => {
        const pill = e.target.closest('.filter-pill[data-city]');
        if (!pill) return;
        document.querySelectorAll('.filter-pill[data-city]').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        applyFilters();
    });

    setupLogoutButton();
    checkAuthAndFetchPlaces();
    fetchHeroStats();
}

function applyFilters() {
    const maxPrice  = document.getElementById('price-filter')?.value || 'all';
    const activeCity = document.querySelector('.filter-pill[data-city].active')?.dataset.city || 'all';

    document.querySelectorAll('.place-card').forEach(card => {
        const priceOk = maxPrice === 'all' || (!isNaN(parseFloat(card.dataset.price)) && parseFloat(card.dataset.price) <= parseFloat(maxPrice));
        const cityOk  = activeCity === 'all' || card.dataset.city === activeCity;
        card.style.display = (priceOk && cityOk) ? '' : 'none';
    });
}

function buildCityPills(places) {
    const pillsContainer = document.getElementById('city-pills');
    if (!pillsContainer) return;

    const cities = [...new Set(places.map(p => p.city).filter(Boolean))].sort();
    cities.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'filter-pill';
        btn.dataset.city = city;
        btn.type = 'button';
        btn.textContent = city;
        pillsContainer.appendChild(btn);
    });
}

async function fetchHeroStats() {
    try {
        const [placesRes, reviewsRes] = await Promise.all([
            fetch(`${API_URL}/api/v1/places/`),
            fetch(`${API_URL}/api/v1/reviews/`)
        ]);
        if (!placesRes.ok || !reviewsRes.ok) throw new Error();

        const places  = await placesRes.json();
        const reviews = await reviewsRes.json();

        const count   = places.length;
        const rCount  = reviews.length;
        const avg     = rCount > 0
            ? (reviews.reduce((s, r) => s + r.rating, 0) / rCount).toFixed(1)
            : null;

        const pEl = document.getElementById('stat-hero-places');
        const rEl = document.getElementById('stat-hero-reviews');
        const aEl = document.getElementById('stat-hero-rating');

        if (pEl) pEl.textContent = count  + '+';
        if (rEl) rEl.textContent = rCount + '+';
        if (aEl) aEl.textContent = avg ? `★ ${avg}` : '—';
    } catch (_) {
        /* API offline — fall back to static values */
        const pEl = document.getElementById('stat-hero-places');
        const rEl = document.getElementById('stat-hero-reviews');
        const aEl = document.getElementById('stat-hero-rating');
        if (pEl) pEl.textContent = '6+';
        if (rEl) rEl.textContent = '26+';
        if (aEl) aEl.textContent = '★ 4.8';
    }
}

/** Check auth, sync UI, then fetch places */
function checkAuthAndFetchPlaces() {
    const token = getCookie('token');
    syncAuthUI(token);
    fetchPlaces(token);
}

/** Fetch all places from API, with per-place detail enrichment */
async function fetchPlaces(token) {
    const placesList = document.getElementById('places-list');
    showLoading(placesList);

    try {
        const headers  = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_URL}/api/v1/places/`, { headers });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const places = await response.json();

        /* Enrich list with price, amenities, and reviews via detail endpoints */
        const detailed = await Promise.all(
            places.map(async (place) => {
                try {
                    const [dr, rr] = await Promise.all([
                        fetch(`${API_URL}/api/v1/places/${place.id}`, { headers }),
                        fetch(`${API_URL}/api/v1/places/${place.id}/reviews`)
                    ]);
                    const enriched = dr.ok ? await dr.json() : place;
                    enriched._reviews = rr.ok ? await rr.json() : [];
                    return enriched;
                } catch (_) { return place; }
            })
        );
        displayPlaces(detailed);
    } catch (_) {
        /* API offline — show mock data with info toast */
        showToast('API offline — showing demo places 🌸', 'info');
        displayPlaces(MOCK_PLACES);
    }
}

/** Render place cards into #places-list */
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    if (!places || places.length === 0) {
        placesList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🌸</div>
                <h3>No places found</h3>
                <p>Try adjusting the price filter or check back later.</p>
            </div>`;
        return;
    }

    places.forEach((place, index) => {
        const price      = place.price !== undefined ? place.price : null;
        const imageUrl   = place.image_url || PLACE_IMAGES[place.id] || PLACE_IMAGES_BY_TITLE[place.title] || null;
        const gradient   = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
        const reviews    = place._reviews || MOCK_REVIEWS[place.id] || [];
        const avg        = avgRating(reviews);
        const amenities  = (place.amenities || []).slice(0, 3);

        const card = document.createElement('div');
        card.classList.add('place-card');
        card.dataset.price = price !== null ? price : '';
        if (place.city) card.dataset.city = place.city;

        /* Build amenity preview pills */
        const amenityHTML = amenities.map((a) =>
            `<span class="card-amenity">${getAmenityIcon(a.name)} ${escapeHTML(a.name)}</span>`
        ).join('');

        /* Stars */
        const starsHTML = avg
            ? `<div class="card-stars">
                   <span class="stars-filled">${renderStars(Math.round(parseFloat(avg)))}</span>
                   <span class="stars-count">${avg}</span>
               </div>`
            : '';

        card.innerHTML = `
            <div class="card-image">
                <div class="img-fallback" style="background:${gradient};position:absolute;inset:0;"></div>
                ${imageUrl ? `<img src="${imageUrl}" alt="${escapeHTML(place.title)}" loading="lazy">` : ''}
                ${price !== null ? `<span class="card-price-badge">$${price} / night</span>` : ''}
            </div>
            <div class="card-body">
                <p class="card-location">${place.city ? escapeHTML(place.city) + ' · ' : ''}${escapeHTML(place.owner ? place.owner.first_name + ' ' + place.owner.last_name : 'HBnB Host')}</p>
                <h3>${escapeHTML(place.title)}</h3>
                ${starsHTML}
                <div class="card-amenities">${amenityHTML}</div>
                <a href="place.html?id=${encodeURIComponent(place.id)}" class="details-button">View Details</a>
            </div>`;

        placesList.appendChild(card);
    });

    buildCityPills(places);
}

/* ─────────────────────────────────────────────
   PLACE DETAILS PAGE
───────────────────────────────────────────── */
function setupPlacePage() {
    const placeId = getPlaceIdFromURL();
    if (!placeId) { window.location.href = 'index.html'; return; }

    const token            = getCookie('token');
    const addReviewSection = document.getElementById('add-review');

    syncAuthUI(token);
    setupLogoutButton();

    /* Show add-review section only when authenticated */
    if (addReviewSection) addReviewSection.style.display = token ? 'block' : 'none';

    fetchPlaceDetails(token, placeId);

    /* Inline review form (place.html) */
    const reviewForm = document.getElementById('review-form');
    if (reviewForm && token) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const reviewText = document.getElementById('review-text').value.trim();
            const rating     = getSelectedStarRating('inline-star') || parseInt(document.getElementById('rating')?.value || '0', 10);

            if (!reviewText || !rating) {
                showToast('Please write your review and select a rating.', 'error');
                return;
            }
            const res = await submitReview(token, placeId, reviewText, rating);
            if (res.ok) {
                showToast('Review submitted! Thank you 🌸', 'success');
                reviewForm.reset();
                resetStars('inline-star');
                fetchReviews(placeId);
            } else {
                showToast('Failed to submit review. Please try again.', 'error');
            }
        });
    }
}

/** GET /api/v1/places/<id> and render */
async function fetchPlaceDetails(token, placeId) {
    const detailsSection = document.getElementById('place-details');
    showLoading(detailsSection);

    /* Mock place — serve from local data */
    if (placeId.startsWith('mock-')) {
        const mock = MOCK_PLACES.find((p) => p.id === placeId);
        if (mock) {
            displayPlaceDetails(mock, placeId);
            fetchReviews(placeId);
        } else {
            showPlaceNotFound(detailsSection);
        }
        return;
    }

    try {
        const headers  = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_URL}/api/v1/places/${placeId}`, { headers });

        if (response.status === 404) { showPlaceNotFound(detailsSection); return; }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const place = await response.json();
        displayPlaceDetails(place, placeId);
        fetchReviews(placeId);
    } catch (_) {
        detailsSection.innerHTML = `
            <div class="empty-state error-state">
                <div class="empty-icon">⚠️</div>
                <h3>Could not load place details</h3>
                <p>Make sure the API server is running at <code>localhost:5000</code>.</p>
            </div>`;
    }
}

function showPlaceNotFound(section) {
    section.innerHTML = `
        <div class="empty-state error-state">
            <div class="empty-icon">🔍</div>
            <h3>Place not found</h3>
            <p><a href="index.html">← Back to listings</a></p>
        </div>`;
}

/** Render full place info into #place-details (.place-details) */
function displayPlaceDetails(place, placeId) {
    const section = document.getElementById('place-details');
    if (!section) return;

    /* Update hero image */
    const heroImg = document.querySelector('.place-hero-image img');
    if (heroImg) {
        const imageUrl = place.image_url || PLACE_IMAGES[placeId] || PLACE_IMAGES_BY_TITLE[place.title];
        if (imageUrl) {
            heroImg.src = imageUrl;
            heroImg.alt = place.title;
        } else {
            heroImg.style.display = 'none';
            const hero = document.querySelector('.place-hero-image');
            if (hero) hero.style.background = CARD_GRADIENTS[0];
        }
    }

    /* Show delete button only for owner or admin */
    const token   = getCookie('token');
    const claims  = token ? decodeToken(token) : null;
    const isOwner = claims && place.owner && claims.sub === place.owner.id;
    const isAdmin = claims && claims.is_admin;
    const deleteBtn = (isOwner || isAdmin)
        ? `<button class="delete-btn" onclick="deletePlace('${escapeHTML(placeId)}')">
               🗑 Delete place
           </button>`
        : '';

    const ownerName = place.owner
        ? `<a href="profile.html?id=${encodeURIComponent(place.owner.id)}">${escapeHTML(place.owner.first_name)} ${escapeHTML(place.owner.last_name)}</a>`
        : 'HBnB Host';

    /* Show booking section for logged-in non-owners */
    const bookingSection = document.getElementById('booking-section');
    if (bookingSection) {
        const isOwner = claims && place.owner && claims.sub === place.owner.id;
        bookingSection.style.display = (token && !isOwner) ? '' : 'none';
        if (token && !isOwner) {
            setupBookingForm(placeId, token);
        }
    }

    const amenitiesHTML = place.amenities && place.amenities.length > 0
        ? place.amenities.map((a) =>
            `<span class="amenity-tag"><span class="amenity-icon">${getAmenityIcon(a.name)}</span>${escapeHTML(a.name)}</span>`
          ).join('')
        : '<span class="amenity-tag">No amenities listed</span>';

    /* Reviews for rating display */
    const reviews = MOCK_REVIEWS[placeId] || [];
    const avg     = avgRating(reviews);
    const ratingHTML = avg
        ? `<div class="place-rating-row">
               <span class="place-rating-stars">${renderStars(Math.round(parseFloat(avg)))}</span>
               <span>${avg} · ${reviews.length} review${reviews.length !== 1 ? 's' : ''}</span>
           </div>`
        : '';

    section.innerHTML = `
        <h1>${escapeHTML(place.title)}</h1>
        <div class="place-subtitle-row">
            <span class="place-host-badge">Hosted by <strong>${ownerName}</strong>${place.city ? ` · <span class="place-city">📍 ${escapeHTML(place.city)}</span>` : ''}</span>
            ${ratingHTML}
        </div>
        <div class="place-info">
            <p><strong>Price per night</strong><span class="info-value">$${place.price !== undefined ? place.price : 'N/A'}</span></p>
            <p><strong>Location</strong><span class="info-value">${place.latitude?.toFixed(4)}, ${place.longitude?.toFixed(4)}</span></p>
        </div>
        <p class="place-description">
            <strong>About this place</strong>
            ${escapeHTML(place.description || 'No description provided.')}
        </p>
        <div class="amenities-list">
            <strong>What's included</strong>
            ${amenitiesHTML}
        </div>
        ${deleteBtn}`;
}

/** GET reviews for a place, enriched with user names */
async function fetchReviews(placeId) {
    const reviewsSection = document.getElementById('reviews');
    if (!reviewsSection) return;

    if (placeId.startsWith('mock-')) {
        displayReviews(MOCK_REVIEWS[placeId] || [], reviewsSection);
        return;
    }

    try {
        /* Fetch all reviews + all users in parallel, then cross-reference */
        const [rvRes, usRes] = await Promise.all([
            fetch(`${API_URL}/api/v1/reviews/`),
            fetch(`${API_URL}/api/v1/users/`)
        ]);

        if (!rvRes.ok) throw new Error(`HTTP ${rvRes.status}`);

        const allReviews = await rvRes.json();
        const userMap = {};
        if (usRes.ok) {
            const users = await usRes.json();
            users.forEach(u => { userMap[u.id] = u; });
        }

        /* Filter to this place and attach user info */
        const reviews = allReviews
            .filter(r => r.place_id === placeId)
            .map(r => ({ ...r, user: userMap[r.user_id] || null }));

        displayReviews(reviews, reviewsSection);
    } catch (_) {
        reviewsSection.innerHTML = `<div class="reviews-header"><h2>Reviews</h2></div>
            <p class="no-places">Unable to load reviews.</p>`;
    }
}

/** Render review cards into #reviews section */
function displayReviews(reviews, container) {
    const avg   = avgRating(reviews);
    const count = reviews ? reviews.length : 0;

    container.innerHTML = `
        <div class="reviews-header">
            <h2>Reviews</h2>
            ${count > 0 ? `<span class="reviews-count">${count} review${count !== 1 ? 's' : ''}${avg ? ' · ★ ' + avg : ''}</span>` : ''}
        </div>`;

    /* Update place detail header rating if present and empty (real API places) */
    if (count > 0 && avg) {
        const subtitleRow = document.querySelector('.place-subtitle-row');
        const existingRating = document.querySelector('.place-rating-row');
        if (subtitleRow && !existingRating) {
            subtitleRow.insertAdjacentHTML('beforeend', `
                <div class="place-rating-row">
                    <span class="place-rating-stars">${renderStars(Math.round(parseFloat(avg)))}</span>
                    <span>${avg} · ${count} review${count !== 1 ? 's' : ''}</span>
                </div>`);
        }
    }

    if (!reviews || reviews.length === 0) {
        container.innerHTML += `
            <div class="empty-state empty-reviews">
                <div class="empty-icon">💬</div>
                <p>No reviews yet — be the first to share your experience!</p>
            </div>`;
        return;
    }

    /* Decode token once for all review cards */
    const token         = getCookie('token');
    const claims        = token ? decodeToken(token) : null;
    const currentUserId = claims?.sub || null;
    const isAdmin       = claims?.is_admin || false;
    const placeId       = getPlaceIdFromURL();

    reviews.forEach((review) => {
        const card = document.createElement('div');
        card.classList.add('review-card');

        const user     = review.user || {};
        const initials = ((user.first_name || 'A')[0] + (user.last_name || 'N')[0]).toUpperCase();
        const fullName = user.first_name ? `${escapeHTML(user.first_name)} ${escapeHTML(user.last_name)}` : 'Anonymous';
        const usernameHTML = (user.id && user.first_name)
            ? `<a href="profile.html?id=${encodeURIComponent(user.id)}" class="review-username">${fullName}</a>`
            : `<span class="review-username">${fullName}</span>`;

        const canDelete = review.id && (isAdmin || currentUserId === review.user_id);
        const deleteBtn = canDelete
            ? `<button class="delete-btn delete-btn--sm"
                       onclick="deleteReview('${review.id}','${placeId}')">🗑</button>`
            : '';

        card.innerHTML = `
            <div class="review-header">
                <div class="review-user">
                    <div class="review-avatar">${initials}</div>
                    ${usernameHTML}
                </div>
                <div class="review-header-right">
                    <span class="review-rating">${renderStars(review.rating)}</span>
                    ${deleteBtn}
                </div>
            </div>
            <p>${escapeHTML(review.text)}</p>`;

        container.appendChild(card);
    });
}

/* ─────────────────────────────────────────────
   STAR RATING WIDGET — utils
───────────────────────────────────────────── */

/** Get value from star radio group by name */
function getSelectedStarRating(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? parseInt(checked.value, 10) : 0;
}

/** Reset star radio group */
function resetStars(name) {
    document.querySelectorAll(`input[name="${name}"]`).forEach((r) => { r.checked = false; });
}

/* ─────────────────────────────────────────────
   ADD REVIEW PAGE (add_review.html)
───────────────────────────────────────────── */
function setupAddReviewPage() {
    /* Redirect unauthenticated users immediately */
    const token = getCookie('token');
    if (!token) { window.location.href = 'index.html'; return; }

    const placeId = getPlaceIdFromURL();
    if (!placeId) { window.location.href = 'index.html'; return; }

    syncAuthUI(token);
    setupLogoutButton();
    loadPlaceName(placeId, token);

    const reviewForm = document.getElementById('review-form');
    if (!reviewForm) return;

    reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        /* id="review" required by spec on add_review.html */
        const reviewText = document.getElementById('review').value.trim();
        /* Star rating widget or select fallback */
        const rating = getSelectedStarRating('star-rating') || parseInt(document.getElementById('rating')?.value || '0', 10);

        if (!reviewText || !rating) {
            showToast('Please write your review and select a rating.', 'error');
            return;
        }

        const response = await submitReview(token, placeId, reviewText, rating);
        await handleReviewResponse(response, reviewForm, placeId);
    });
}

/** Fetch place name and inject into #place-name-display */
async function loadPlaceName(placeId, token) {
    /* Check mock first */
    const mock = MOCK_PLACES.find((p) => p.id === placeId);
    if (mock) {
        const display = document.getElementById('place-name-display');
        if (display) display.textContent = mock.title;
        return;
    }

    try {
        const headers  = token ? { 'Authorization': `Bearer ${token}` } : {};
        const response = await fetch(`${API_URL}/api/v1/places/${placeId}`, { headers });
        if (response.ok) {
            const place   = await response.json();
            const display = document.getElementById('place-name-display');
            if (display) display.textContent = place.title;
        }
    } catch (_) { /* non-critical */ }
}

/** POST a review to the API */
async function submitReview(token, placeId, reviewText, rating) {
    return fetch(`${API_URL}/api/v1/reviews/`, {
        method: 'POST',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: reviewText, rating, place_id: placeId })
    });
}

/** Handle review POST response */
async function handleReviewResponse(response, form, placeId) {
    if (response.ok) {
        showToast('Review submitted successfully! 🌸', 'success');
        form.reset();
        resetStars('star-rating');
        setTimeout(() => {
            window.location.href = `place.html?id=${encodeURIComponent(placeId)}`;
        }, 1300);
    } else {
        const err = await response.json().catch(() => ({}));
        showToast('Failed to submit: ' + (err.error || response.statusText), 'error');
    }
}

/* ─────────────────────────────────────────────
   DELETE PLACE
───────────────────────────────────────────── */
async function deletePlace(placeId) {
    if (!confirm('Delete this place? This cannot be undone.')) return;
    const token = getCookie('token');
    try {
        const res = await fetch(`${API_URL}/api/v1/places/${placeId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            showToast('Place deleted. Redirecting…', 'success');
            setTimeout(() => { window.location.href = 'index.html'; }, 1100);
        } else {
            const err = await res.json().catch(() => ({}));
            showToast('Could not delete: ' + (err.error || res.statusText), 'error');
        }
    } catch (_) {
        showToast('Error connecting to the API.', 'error');
    }
}

/* ─────────────────────────────────────────────
   DELETE REVIEW
───────────────────────────────────────────── */
async function deleteReview(reviewId, placeId) {
    if (!confirm('Delete this review?')) return;
    const token = getCookie('token');
    try {
        const res = await fetch(`${API_URL}/api/v1/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            showToast('Review deleted.', 'success');
            fetchReviews(placeId);
        } else {
            const err = await res.json().catch(() => ({}));
            showToast('Could not delete: ' + (err.error || res.statusText), 'error');
        }
    } catch (_) {
        showToast('Error connecting to the API.', 'error');
    }
}

/* ─────────────────────────────────────────────
   ADD PLACE PAGE
───────────────────────────────────────────── */
function setupAddPlacePage() {
    const token = getCookie('token');
    if (!token) { window.location.href = 'login.html'; return; }

    const claims = decodeToken(token);
    if (!claims || claims.exp < Date.now() / 1000) {
        showToast('Session expired — please log in again.', 'error');
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        return;
    }

    syncAuthUI(token);
    setupLogoutButton();
    loadAmenitiesCheckboxes();

    /* Image URL preview */
    const imageUrlInput = document.getElementById('image-url');
    const imagePreview  = document.getElementById('image-preview');
    if (imageUrlInput && imagePreview) {
        imageUrlInput.addEventListener('input', () => {
            const url = imageUrlInput.value.trim();
            if (url) {
                imagePreview.src = url;
                imagePreview.style.display = '';
                imagePreview.onerror = () => { imagePreview.style.display = 'none'; };
            } else {
                imagePreview.style.display = 'none';
            }
        });
    }

    const form = document.getElementById('add-place-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title       = document.getElementById('title').value.trim();
        const city        = document.getElementById('city').value.trim();
        const description = document.getElementById('description').value.trim();
        const price       = parseFloat(document.getElementById('price').value);
        const latitude    = parseFloat(document.getElementById('latitude').value);
        const longitude   = parseFloat(document.getElementById('longitude').value);
        const image_url   = document.getElementById('image-url')?.value.trim() || null;
        const amenities   = [...document.querySelectorAll('input[name="amenity"]:checked')]
                              .map(cb => cb.value);

        if (!title || !city || isNaN(price) || isNaN(latitude) || isNaN(longitude)) {
            showToast('Please fill in all required fields.', 'error'); return;
        }

        try {
            const res = await fetch(`${API_URL}/api/v1/places/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title, city, description, price, latitude, longitude,
                    image_url: image_url || undefined,
                    amenities
                })
            });

            if (res.ok) {
                const place = await res.json();
                showToast('Place listed! Redirecting…', 'success');
                setTimeout(() => {
                    window.location.href = `place.html?id=${encodeURIComponent(place.id)}`;
                }, 1000);
            } else {
                const err = await res.json().catch(() => ({}));
                showToast('Failed: ' + (err.error || res.statusText), 'error');
            }
        } catch (_) {
            showToast('Cannot reach the API. Is the server running?', 'error');
        }
    });
}

async function loadAmenitiesCheckboxes() {
    const container = document.getElementById('amenities-checkboxes');
    if (!container) return;
    try {
        const res = await fetch(`${API_URL}/api/v1/amenities/`);
        if (!res.ok) throw new Error();
        const amenities = await res.json();
        if (amenities.length === 0) {
            container.innerHTML = '<p class="muted-text">No amenities available.</p>';
            return;
        }
        container.innerHTML = amenities.map(a => `
            <label class="amenity-checkbox">
                <input type="checkbox" name="amenity" value="${escapeHTML(a.id)}">
                <span>${getAmenityIcon(a.name)} ${escapeHTML(a.name)}</span>
            </label>`).join('');
    } catch (_) {
        container.innerHTML = '<p class="muted-text">Could not load amenities.</p>';
    }
}

/* ─────────────────────────────────────────────
   PROFILE / ACCOUNT PAGE
───────────────────────────────────────────── */
async function setupProfilePage() {
    const token  = getCookie('token');
    const claims = token ? decodeToken(token) : null;

    /* ?id param → viewing someone else's profile */
    const params         = new URLSearchParams(window.location.search);
    const viewId         = params.get('id');
    const ownId          = claims ? claims.sub : null;
    const isOwnProfile   = !viewId || viewId === ownId;

    /* Own profile requires authentication */
    if (isOwnProfile) {
        if (!token) { window.location.href = 'login.html'; return; }
        if (!claims || claims.exp < Date.now() / 1000) {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
            window.location.href = 'login.html';
            return;
        }
    }

    syncAuthUI(token);
    setupLogoutButton();

    const targetId = isOwnProfile ? ownId : viewId;
    const headers  = token ? { 'Authorization': `Bearer ${token}` } : {};

    /* Hide own-profile-only sections when viewing public profile */
    if (!isOwnProfile) {
        const hideIds = ['profile-stats', 'notifications-section',
                         'owner-bookings-section', 'guest-bookings-section',
                         'add-place-btn', 'delete-account-btn'];
        hideIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        const placeTitle   = document.getElementById('places-section-title');
        const reviewsTitle = document.getElementById('reviews-section-title');
        if (placeTitle)   placeTitle.textContent   = 'Places';
        if (reviewsTitle) reviewsTitle.textContent = 'Reviews';
    }

    try {
        const [userRes, placesRes, reviewsRes] = await Promise.all([
            fetch(`${API_URL}/api/v1/users/${targetId}`, { headers }),
            fetch(`${API_URL}/api/v1/places/`),
            fetch(`${API_URL}/api/v1/reviews/`)
        ]);

        const user       = userRes.ok    ? await userRes.json()    : null;
        const allPlaces  = placesRes.ok  ? await placesRes.json()  : [];
        const allReviews = reviewsRes.ok ? await reviewsRes.json() : [];

        const theirPlaces  = allPlaces.filter(p => p.owner && p.owner.id === targetId);
        const theirReviews = allReviews.filter(r => r.user_id === targetId);

        renderProfileHero(user, isOwnProfile ? { token, userId: ownId } : null);

        if (isOwnProfile) {
            /* Stats */
            const placeIds = new Set(theirPlaces.map(p => p.id));
            const reviewsOnMyPlaces = allReviews.filter(r => placeIds.has(r.place_id));
            const reviewsReceived   = reviewsOnMyPlaces.length;
            const avgReceived = reviewsReceived > 0
                ? (reviewsOnMyPlaces.reduce((s, r) => s + r.rating, 0) / reviewsReceived).toFixed(1)
                : null;

            document.getElementById('stat-places').textContent          = theirPlaces.length;
            document.getElementById('stat-reviews-written').textContent  = theirReviews.length;
            document.getElementById('stat-avg-rating').textContent       = avgReceived ? `★ ${avgReceived}` : '—';
            document.getElementById('stat-reviews-received').textContent = reviewsReceived;

            /* Notifications + bookings */
            await renderProfileNotifications(token);
            await renderProfileBookings(token);

            /* Admin panel */
            if (claims.is_admin) setupAdminPanel(token);
        }

        /* Enrich places with full details */
        const enriched = await Promise.all(theirPlaces.map(async (p) => {
            try {
                const dr = await fetch(`${API_URL}/api/v1/places/${p.id}`);
                return dr.ok ? await dr.json() : p;
            } catch (_) { return p; }
        }));

        renderProfilePlaces(enriched, allReviews, isOwnProfile);
        renderProfileReviews(theirReviews, allPlaces, isOwnProfile);

    } catch (_) {
        showToast('Could not load profile data.', 'error');
    }
}

function renderProfileHero(user, ownCtx) {
    const name     = user ? `${user.first_name} ${user.last_name}` : (ownCtx ? 'Your Account' : 'Unknown User');
    const initials = user ? (user.first_name[0] + user.last_name[0]).toUpperCase() : '?';

    const nameEl   = document.getElementById('profile-name');
    const emailEl  = document.getElementById('profile-email');
    const avatarEl = document.getElementById('profile-avatar');
    const delBtn   = document.getElementById('delete-account-btn');

    if (nameEl)   nameEl.textContent   = name;
    if (emailEl)  emailEl.textContent  = (ownCtx && user) ? user.email : '';
    if (avatarEl) avatarEl.textContent = initials;
    document.title = `HBnB — ${name}`;

    if (delBtn && ownCtx) {
        delBtn.style.display = '';
        delBtn.onclick = () => deleteAccount(ownCtx.userId, ownCtx.token);
    }
}

async function renderProfileNotifications(token) {
    const section    = document.getElementById('notifications-section');
    const container  = document.getElementById('profile-notifications');
    if (!section || !container) return;

    try {
        const res = await fetch(`${API_URL}/api/v1/bookings/notifications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data    = await res.json();
        const guest   = data.guest  || [];
        const owner   = data.owner  || [];
        const total   = guest.length + owner.length;

        if (total === 0) return;
        section.style.display = '';

        container.innerHTML = '';

        owner.forEach(b => {
            const card = document.createElement('div');
            card.className = 'notif-card notif-owner';
            card.innerHTML = `
                <span class="notif-icon">🏠</span>
                <div class="notif-body">
                    <p><strong>${escapeHTML(b.user_name)}</strong> requested a booking
                       for <strong>${escapeHTML(b.place_title)}</strong>
                       on <strong>${escapeHTML(b.date)}</strong>.</p>
                </div>
                <a href="profile.html#owner-bookings-section" class="details-button notif-action"
                   onclick="markAndScroll('${b.id}', '${token}')">Review</a>`;
            container.appendChild(card);
        });

        guest.forEach(b => {
            const isApproved = b.status === 'approved';
            const card = document.createElement('div');
            card.className = 'booking-card';
            card.dataset.status = b.status;
            card.innerHTML = `
                <div class="booking-info">
                    <p>Your request for
                       <a href="place.html?id=${encodeURIComponent(b.place_id)}">${escapeHTML(b.place_title)}</a>
                       was <strong>${isApproved ? 'approved' : 'denied'}</strong>.</p>
                    <div class="booking-meta">
                        <span class="booking-date">📅 ${escapeHTML(b.date)}</span>
                        <span class="status-badge status-${b.status}">${b.status}</span>
                    </div>
                </div>
                <div class="booking-actions">
                    <button class="booking-deny"
                            onclick="dismissGuestNotif('${b.id}', '${token}', this)">Dismiss</button>
                </div>`;
            container.appendChild(card);
        });
    } catch (_) {}
}

async function renderProfileBookings(token) {
    try {
        const res = await fetch(`${API_URL}/api/v1/bookings/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();

        const ownerReqs  = data.my_place_bookings || [];
        const guestReqs  = data.my_requests       || [];

        /* Owner: incoming booking requests */
        if (ownerReqs.length > 0) {
            const ownerSection = document.getElementById('owner-bookings-section');
            const ownerCont    = document.getElementById('owner-bookings');
            if (ownerSection && ownerCont) {
                ownerSection.style.display = '';
                ownerCont.innerHTML = '';
                ownerReqs.forEach(b => {
                    const card = document.createElement('div');
                    card.className = 'booking-card';
                    card.dataset.status = b.status;
                    card.id = `booking-owner-${b.id}`;
                    const actions = b.status === 'pending'
                        ? `<button class="details-button booking-approve"
                                   onclick="respondBooking('${b.id}','approved','${token}')">✓ Approve</button>
                           <button class="booking-deny"
                                   onclick="respondBooking('${b.id}','denied','${token}')">✗ Deny</button>`
                        : `<span class="status-badge status-${b.status}">${b.status}</span>`;
                    card.innerHTML = `
                        <div class="booking-info">
                            <p><strong>${escapeHTML(b.user_name)}</strong> wants to book
                               <a href="place.html?id=${encodeURIComponent(b.place_id)}">${escapeHTML(b.place_title)}</a></p>
                            <div class="booking-meta">
                                <span class="booking-date">📅 ${escapeHTML(b.date)}</span>
                            </div>
                        </div>
                        <div class="booking-actions">${actions}</div>`;
                    ownerCont.appendChild(card);
                });
            }
        }

        /* Guest: my booking requests */
        if (guestReqs.length > 0) {
            const guestSection = document.getElementById('guest-bookings-section');
            const guestCont    = document.getElementById('guest-bookings');
            if (guestSection && guestCont) {
                guestSection.style.display = '';
                guestCont.innerHTML = '';
                guestReqs.forEach(b => {
                    const card = document.createElement('div');
                    card.className = 'booking-card';
                    card.dataset.status = b.status;
                    card.innerHTML = `
                        <div class="booking-info">
                            <p><a href="place.html?id=${encodeURIComponent(b.place_id)}">${escapeHTML(b.place_title)}</a></p>
                            <div class="booking-meta">
                                <span class="booking-date">📅 ${escapeHTML(b.date)}</span>
                            </div>
                        </div>
                        <div class="booking-actions">
                            <span class="status-badge status-${b.status}">${b.status}</span>
                        </div>`;
                    guestCont.appendChild(card);
                });
            }
        }
    } catch (_) {}
}

async function respondBooking(bookingId, status, token) {
    try {
        const res = await fetch(`${API_URL}/api/v1/bookings/${bookingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            /* Also mark as seen */
            fetch(`${API_URL}/api/v1/bookings/${bookingId}/seen`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            }).catch(() => {});
            showToast(`Booking ${status}. 🌸`, 'success');
            const card = document.getElementById(`booking-owner-${bookingId}`);
            if (card) {
                card.dataset.status = status;
                const actions = card.querySelector('.booking-actions');
                if (actions) actions.innerHTML = `<span class="status-badge status-${status}">${status}</span>`;
            }
        } else {
            const err = await res.json().catch(() => ({}));
            showToast('Failed: ' + (err.error || res.statusText), 'error');
        }
    } catch (_) {
        showToast('Error connecting to the API.', 'error');
    }
}

async function dismissGuestNotif(bookingId, token, btn) {
    await fetch(`${API_URL}/api/v1/bookings/${bookingId}/seen`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    }).catch(() => {});
    const card = btn.closest('.booking-card, .notif-card');
    if (card) card.remove();

    const section = document.getElementById('notifications-section');
    const container = document.getElementById('profile-notifications');
    if (section && container && container.children.length === 0) {
        section.style.display = 'none';
    }
}

function markAndScroll(bookingId, token) {
    fetch(`${API_URL}/api/v1/bookings/${bookingId}/seen`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    }).catch(() => {});
}

function renderProfilePlaces(places, allReviews, canEdit) {
    const container = document.getElementById('profile-places');
    if (!container) return;

    if (places.length === 0) {
        container.innerHTML = `
            <div class="empty-state empty-reviews">
                <div class="empty-icon">🏡</div>
                <p>${canEdit ? "You haven't listed any places yet." : 'No places listed.'}</p>
            </div>`;
        return;
    }

    container.innerHTML = '';
    places.forEach((place, index) => {
        const gradient     = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
        const imageUrl     = place.image_url || PLACE_IMAGES[place.id] || PLACE_IMAGES_BY_TITLE[place.title] || null;
        const placeReviews = allReviews.filter(r => r.place_id === place.id);
        const avg          = avgRating(placeReviews);
        const amenities    = (place.amenities || []).slice(0, 3);
        const amenityHTML  = amenities.map(a =>
            `<span class="card-amenity">${getAmenityIcon(a.name)} ${escapeHTML(a.name)}</span>`
        ).join('');

        const actionsHTML = canEdit
            ? `<div class="profile-card-actions">
                   <a href="place.html?id=${encodeURIComponent(place.id)}" class="details-button">View</a>
                   <button class="delete-btn delete-btn--sm"
                           onclick="deletePlace('${place.id}')">🗑 Delete</button>
               </div>`
            : `<a href="place.html?id=${encodeURIComponent(place.id)}" class="details-button">View</a>`;

        const card = document.createElement('div');
        card.className = 'place-card';
        card.dataset.price = place.price || '';
        card.innerHTML = `
            <div class="card-image">
                <div class="img-fallback" style="background:${gradient};position:absolute;inset:0;"></div>
                ${imageUrl ? `<img src="${imageUrl}" alt="${escapeHTML(place.title)}" loading="lazy">` : ''}
                ${place.price != null ? `<span class="card-price-badge">$${place.price} / night</span>` : ''}
            </div>
            <div class="card-body">
                <h3>${escapeHTML(place.title)}</h3>
                ${avg ? `<div class="card-stars"><span class="stars-filled">${renderStars(Math.round(parseFloat(avg)))}</span><span class="stars-count">${avg} (${placeReviews.length})</span></div>` : ''}
                <div class="card-amenities">${amenityHTML}</div>
                ${actionsHTML}
            </div>`;
        container.appendChild(card);
    });
}

async function renderProfileReviews(reviews, allPlaces, canEdit) {
    const container = document.getElementById('profile-reviews');
    if (!container) return;

    if (reviews.length === 0) {
        container.innerHTML = `
            <div class="empty-state empty-reviews">
                <div class="empty-icon">💬</div>
                <p>${canEdit ? "You haven't written any reviews yet." : 'No reviews yet.'}</p>
            </div>`;
        return;
    }

    const placeMap = {};
    allPlaces.forEach(p => { placeMap[p.id] = p.title; });

    reviews.forEach(review => {
        const placeTitle = placeMap[review.place_id] || 'Unknown place';
        const card = document.createElement('div');
        card.className = 'review-card profile-review-card';
        const deleteHTML = canEdit
            ? `<button class="delete-btn delete-btn--sm"
                       onclick="deleteReviewFromProfile('${review.id}')">🗑</button>`
            : '';
        card.innerHTML = `
            <div class="review-header">
                <div class="review-user">
                    <a href="place.html?id=${encodeURIComponent(review.place_id)}"
                       class="profile-review-place">${escapeHTML(placeTitle)}</a>
                </div>
                <div class="review-header-right">
                    <span class="review-rating">${renderStars(review.rating)}</span>
                    ${deleteHTML}
                </div>
            </div>
            <p>${escapeHTML(review.text)}</p>`;
        container.appendChild(card);
    });
}

async function deleteReviewFromProfile(reviewId) {
    if (!confirm('Delete this review?')) return;
    const token = getCookie('token');
    try {
        const res = await fetch(`${API_URL}/api/v1/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            showToast('Review deleted.', 'success');
            setupProfilePage();
        } else {
            const err = await res.json().catch(() => ({}));
            showToast('Could not delete: ' + (err.error || res.statusText), 'error');
        }
    } catch (_) {
        showToast('Error connecting to the API.', 'error');
    }
}

/* ─────────────────────────────────────────────
   ADMIN PANEL (profile.html — admin only)
───────────────────────────────────────────── */
function setupAdminPanel(token) {
    const panel = document.getElementById('admin-panel');
    if (!panel) return;
    panel.style.display = '';

    const form = document.getElementById('admin-amenity-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('new-amenity-name').value.trim();
        if (!name) return;
        try {
            const res = await fetch(`${API_URL}/api/v1/amenities/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            });
            if (res.ok) {
                showToast(`Amenity "${name}" created! 🌸`, 'success');
                form.reset();
            } else {
                const err = await res.json().catch(() => ({}));
                showToast('Failed: ' + (err.error || res.statusText), 'error');
            }
        } catch (_) {
            showToast('Cannot reach the API.', 'error');
        }
    });
}

/* ─────────────────────────────────────────────
   BOOKING FORM (place.html)
───────────────────────────────────────────── */
function setupBookingForm(placeId, token) {
    const form = document.getElementById('booking-form');
    if (!form || form.dataset.ready) return;
    form.dataset.ready = '1';

    /* Set min date to today */
    const dateInput = document.getElementById('booking-date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const date = document.getElementById('booking-date').value;
        if (!date) { showToast('Please select a date.', 'error'); return; }

        try {
            const res = await fetch(`${API_URL}/api/v1/bookings/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ place_id: placeId, date })
            });
            if (res.ok) {
                showToast('Booking request sent! The owner will review it. 🌸', 'success');
                form.reset();
            } else {
                const err = await res.json().catch(() => ({}));
                showToast('Failed: ' + (err.error || res.statusText), 'error');
            }
        } catch (_) {
            showToast('Cannot reach the API.', 'error');
        }
    });
}

/* ─────────────────────────────────────────────
   DELETE ACCOUNT
───────────────────────────────────────────── */
async function deleteAccount(userId, token) {
    if (!confirm('Delete your account? Your places will be removed. Reviews you wrote will remain as "Deleted User". This cannot be undone.')) return;
    try {
        const res = await fetch(`${API_URL}/api/v1/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
            showToast('Account deleted. Goodbye! 🌸', 'info');
            setTimeout(() => { window.location.href = 'index.html'; }, 1200);
        } else {
            const err = await res.json().catch(() => ({}));
            showToast('Could not delete: ' + (err.error || res.statusText), 'error');
        }
    } catch (_) {
        showToast('Error connecting to the API.', 'error');
    }
}

/* ─────────────────────────────────────────────
   STAGGERED CARD ENTRANCE
   (called by petals.js MutationObserver)
───────────────────────────────────────────── */
function animateCards() {
    const cards = document.querySelectorAll('.place-card, .review-card');
    cards.forEach((card, i) => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity .4s ease ${i * 0.07}s,
                                  transform .5s cubic-bezier(.34,1.56,.64,1) ${i * 0.07}s`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            card.style.opacity   = '';
            card.style.transform = '';
        }));
    });
}

/* Export for petals.js */
window.animateCards = animateCards;

/* ─────────────────────────────────────────────
   ROUTER — detect page and run setup
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   STAR RATING LABEL — live hover/select text
───────────────────────────────────────────── */
const STAR_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very good', 5: 'Excellent ✨' };

function initStarLabelWidget(groupName, labelElId) {
    const labels = document.querySelectorAll(`input[name="${groupName}"] + label`);
    const display = document.getElementById(labelElId);
    if (!labels.length || !display) return;

    /* Group = all radios + labels */
    const inputs = document.querySelectorAll(`input[name="${groupName}"]`);

    labels.forEach(lbl => {
        const val = parseInt(lbl.previousElementSibling?.value || '0', 10);
        lbl.addEventListener('mouseenter', () => {
            display.textContent = STAR_LABELS[val] || '';
        });
        lbl.addEventListener('mouseleave', () => {
            /* Show selected value on leave, or blank if none */
            const checked = document.querySelector(`input[name="${groupName}"]:checked`);
            display.textContent = checked ? (STAR_LABELS[parseInt(checked.value, 10)] || '') : '';
        });
    });

    inputs.forEach(inp => {
        inp.addEventListener('change', () => {
            display.textContent = STAR_LABELS[parseInt(inp.value, 10)] || '';
            /* Ensure the selected label gets the checked color via data attr */
            const parent = inp.closest('.star-rating');
            if (parent) parent.dataset.selected = inp.value;
        });
    });
}

/* ─────────────────────────────────────────────
   COOKIE CONSENT BANNER (GDPR)
───────────────────────────────────────────── */
function setupCookieBanner() {
    if (localStorage.getItem('gdpr-consent')) return;

    const banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = `
        <div class="cookie-banner-inner">
            <div class="cookie-text">
                <strong>🍪 We use cookies</strong>
                <p>HBnB uses a strictly necessary session cookie to keep you signed in.
                   No tracking, no advertising. By clicking "Accept", you consent to this
                   cookie in accordance with our
                   <a href="privacy.html">Privacy Policy</a>.</p>
            </div>
            <div class="cookie-actions">
                <button id="cookie-decline" class="cookie-btn cookie-btn--outline">Decline</button>
                <button id="cookie-accept"  class="cookie-btn cookie-btn--primary">Accept</button>
            </div>
        </div>`;

    document.body.appendChild(banner);
    requestAnimationFrame(() => requestAnimationFrame(() => banner.classList.add('cookie-banner--show')));

    document.getElementById('cookie-accept').addEventListener('click', () => {
        localStorage.setItem('gdpr-consent', 'accepted');
        hideBanner(banner);
    });

    document.getElementById('cookie-decline').addEventListener('click', () => {
        localStorage.setItem('gdpr-consent', 'declined');
        /* Remove any existing session cookie if user declines */
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
        hideBanner(banner);
        showToast('Non-essential cookies declined. You will need to sign in each visit.', 'info');
    });
}

function hideBanner(banner) {
    banner.classList.remove('cookie-banner--show');
    setTimeout(() => banner.remove(), 400);
}

document.addEventListener('DOMContentLoaded', () => {
    setupHamburger();
    setupCookieBanner();
    /* Wire up star label widgets on pages that have them */
    initStarLabelWidget('inline-star', 'inline-star-label');
    initStarLabelWidget('star-rating', 'star-rating-label');

    const path = window.location.pathname;

    if      (path.includes('login.html'))      setupLoginPage();
    else if (path.includes('register.html'))   setupRegisterPage();
    else if (path.includes('add_place.html'))  setupAddPlacePage();
    else if (path.includes('profile.html'))    setupProfilePage();
    else if (path.includes('place.html'))      setupPlacePage();
    else if (path.includes('add_review.html')) setupAddReviewPage();
    else                                        setupIndexPage();
});
