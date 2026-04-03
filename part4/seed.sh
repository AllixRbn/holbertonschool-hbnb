#!/usr/bin/env bash
# =============================================================
#  HBnB — seed.sh
#  Populates the database entirely through the existing API.
#  No backend files are touched.
#
#  Usage: bash part4/seed.sh
#  Requires: backend running at http://127.0.0.1:5000
# =============================================================

set -euo pipefail

API="http://127.0.0.1:5000/api/v1"

# ── Colours ─────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "  ${GREEN}✔${NC}  $*" >&2; }
warn() { echo -e "  ${YELLOW}⚠${NC}  $*" >&2; }
fail() { echo -e "  ${RED}✘${NC}  $*" >&2; exit 1; }

# ── Helpers ──────────────────────────────────────────────────

# Extract a top-level string field from JSON
json_get() {
    python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('$2',''))" <<< "$1"
}

# POST with optional Bearer token; returns response body
api_post() {
    local url="$1" body="$2" token="${3:-}"
    if [ -n "$token" ]; then
        curl -s -X POST "$url" \
             -H "Content-Type: application/json" \
             -H "Authorization: Bearer $token" \
             -d "$body"
    else
        curl -s -X POST "$url" \
             -H "Content-Type: application/json" \
             -d "$body"
    fi
}

# Login → return access_token (or fail)
login() {
    local email="$1" pass="$2"
    local body resp token
    body=$(python3 -c "import json; print(json.dumps({'email':'$email','password':'$pass'}))")
    resp=$(api_post "$API/auth/login" "$body")
    token=$(json_get "$resp" "access_token")
    [ -z "$token" ] && fail "Login failed for $email — $(json_get "$resp" "error")"
    echo "$token"
}

# Create user; return id (skip gracefully if already registered)
create_user() {
    local first="$1" last="$2" email="$3" pass="$4"
    local body resp id errmsg

    body=$(python3 -c "import json
print(json.dumps({'first_name':'$first','last_name':'$last','email':'$email','password':'$pass'}))")

    resp=$(api_post "$API/users/" "$body")
    id=$(json_get "$resp" "id")

    if [ -n "$id" ]; then
        ok "$first $last created  (id: $id)"
    else
        errmsg=$(json_get "$resp" "error")
        warn "$first $last — $errmsg  (fetching existing id)"
        id=$(curl -s "$API/users/" | python3 -c \
            "import sys,json; us=json.load(sys.stdin); match=[u['id'] for u in us if u['email']=='$email']; print(match[0] if match else '')")
        [ -z "$id" ] && fail "Could not retrieve id for $email"
        ok "$first $last fetched  (id: $id)"
    fi
    echo "$id"
}

# Create amenity with admin token; return id (skip if duplicate name)
create_amenity() {
    local name="$1" admin_token="$2"
    local body resp id errmsg existing

    # Check if already exists
    existing=$(curl -s "$API/amenities/" | python3 -c \
        "import sys,json; items=json.load(sys.stdin); match=[a['id'] for a in items if a['name']=='$name']; print(match[0] if match else '')")

    if [ -n "$existing" ]; then
        warn "Amenity '$name' already exists  (id: $existing)"
        echo "$existing"
        return
    fi

    body=$(python3 -c "import json; print(json.dumps({'name':'$name'}))")
    resp=$(api_post "$API/amenities/" "$body" "$admin_token")
    id=$(json_get "$resp" "id")
    [ -z "$id" ] && fail "Could not create amenity '$name': $(json_get "$resp" "error")"
    ok "Amenity '$name'  (id: $id)"
    echo "$id"
}

# Create place (must call while logged in as owner); return id
create_place() {
    local token="$1" title="$2" desc="$3" price="$4" lat="$5" lng="$6"
    shift 6
    local amenity_ids=("$@")

    local body resp id
    body=$(python3 - <<PYEOF
import json
amenities = [x for x in """${amenity_ids[*]}""".split() if x]
print(json.dumps({
    'title':       '$title',
    'description': '$desc',
    'price':       $price,
    'latitude':    $lat,
    'longitude':   $lng,
    'amenities':   amenities
}))
PYEOF
)
    resp=$(api_post "$API/places/" "$body" "$token")
    id=$(json_get "$resp" "id")
    [ -z "$id" ] && fail "Could not create place '$title': $resp"
    ok "'$title'  (id: $id)"
    echo "$id"
}

# Post review; skip if duplicate or owner conflict
post_review() {
    local token="$1" place_id="$2" rating="$3"
    shift 3
    local text="$*"

    local body resp id errmsg
    body=$(python3 - <<PYEOF
import json
print(json.dumps({'text': """$text""", 'rating': $rating, 'place_id': '$place_id'}))
PYEOF
)
    resp=$(api_post "$API/reviews/" "$body" "$token")
    id=$(json_get "$resp" "id")

    if [ -n "$id" ]; then
        ok "Review posted  (rating: $rating/5)"
    else
        errmsg=$(json_get "$resp" "error")
        warn "Skipped — $errmsg"
    fi
}

# =============================================================
echo ""
echo "══════════════════════════════════════════"
echo "   HBnB Database Seeder"
echo "══════════════════════════════════════════"
echo ""

# Sanity check
curl -sf "$API/places/" > /dev/null \
    || fail "API not reachable at $API — start the backend first."
ok "API is reachable at $API"
echo ""

# =============================================================
echo "── Step 1 · Admin login ──────────────────"
ADMIN_TOKEN=$(login "admin@example.com" "admin123")
ok "Admin authenticated"
echo ""

# =============================================================
echo "── Step 2 · Host users ───────────────────"
YUKI_ID=$(create_user   "Yuki"   "Tanaka"   "yuki@hbnb.com"   "sakura123")
EMMA_ID=$(create_user   "Emma"   "Chen"     "emma@hbnb.com"   "blossom123")
KENJI_ID=$(create_user  "Kenji"  "Mori"     "kenji@hbnb.com"  "fuji123")
SOPHIE_ID=$(create_user "Sophie" "Laurent"  "sophie@hbnb.com" "hanami123")
HANA_ID=$(create_user   "Hana"   "Watanabe" "hana@hbnb.com"   "zen123")
LUCA_ID=$(create_user   "Luca"   "Rossi"    "luca@hbnb.com"   "momiji123")
echo ""

# =============================================================
echo "── Step 3 · Guest reviewer users ─────────"
MARIE_ID=$(create_user  "Marie"  "Dupont" "marie@hbnb.com"  "guest123")
THOMAS_ID=$(create_user "Thomas" "Klein"  "thomas@hbnb.com" "guest123")
AIKO_ID=$(create_user   "Aiko"   "Sato"   "aiko@hbnb.com"   "guest123")
JAMES_ID=$(create_user  "James"  "Lee"    "james@hbnb.com"  "guest123")
echo ""

# =============================================================
echo "── Step 4 · Amenities (admin token) ──────"
WIFI_ID=$(create_amenity      "WiFi"               "$ADMIN_TOKEN")
GARDEN_ID=$(create_amenity    "Private Garden"     "$ADMIN_TOKEN")
FLOORS_ID=$(create_amenity    "Heated Floors"      "$ADMIN_TOKEN")
TEAROOM_ID=$(create_amenity   "Tea Room"           "$ADMIN_TOKEN")
MTVIEW_ID=$(create_amenity    "Mountain View"      "$ADMIN_TOKEN")
ROOFTOP_ID=$(create_amenity   "Rooftop Terrace"    "$ADMIN_TOKEN")
ESPRESSO_ID=$(create_amenity  "Espresso Machine"   "$ADMIN_TOKEN")
CITYVIEW_ID=$(create_amenity  "City View"          "$ADMIN_TOKEN")
FIREPLACE_ID=$(create_amenity "Fireplace"          "$ADMIN_TOKEN")
HOTTUB_ID=$(create_amenity    "Hot Tub"            "$ADMIN_TOKEN")
TRAIL_ID=$(create_amenity     "Forest Trail"       "$ADMIN_TOKEN")
BBQ_ID=$(create_amenity       "BBQ Area"           "$ADMIN_TOKEN")
CONCIERGE_ID=$(create_amenity "Concierge"          "$ADMIN_TOKEN")
BREAKFAST_ID=$(create_amenity "Breakfast"          "$ADMIN_TOKEN")
SPA_ID=$(create_amenity       "Spa Access"         "$ADMIN_TOKEN")
MEDITATION_ID=$(create_amenity "Meditation Garden" "$ADMIN_TOKEN")
BICYCLE_ID=$(create_amenity   "Bicycle Rental"     "$ADMIN_TOKEN")
ORGANIC_ID=$(create_amenity   "Organic Breakfast"  "$ADMIN_TOKEN")
TATAMI_ID=$(create_amenity    "Tatami Room"        "$ADMIN_TOKEN")
SAKE_ID=$(create_amenity      "Sake Bar"           "$ADMIN_TOKEN")
BATH_ID=$(create_amenity      "Outdoor Bath"       "$ADMIN_TOKEN")
KOI_ID=$(create_amenity       "Koi Pond"           "$ADMIN_TOKEN")
echo ""

# =============================================================
echo "── Step 5 · Places (logged in as each owner) ─"

YUKI_TOKEN=$(login   "yuki@hbnb.com"   "sakura123")
EMMA_TOKEN=$(login   "emma@hbnb.com"   "blossom123")
KENJI_TOKEN=$(login  "kenji@hbnb.com"  "fuji123")
SOPHIE_TOKEN=$(login "sophie@hbnb.com" "hanami123")
HANA_TOKEN=$(login   "hana@hbnb.com"   "zen123")
LUCA_TOKEN=$(login   "luca@hbnb.com"   "momiji123")
ok "All host tokens obtained"

PLACE1_ID=$(create_place "$YUKI_TOKEN" \
    "Sakura Villa" \
    "A serene Kyoto-inspired garden suite with heated tatami floors and a private tea ceremony room." \
    80 35.011636 135.768029 \
    "$WIFI_ID" "$GARDEN_ID" "$FLOORS_ID" "$TEAROOM_ID" "$MTVIEW_ID")

PLACE2_ID=$(create_place "$EMMA_TOKEN" \
    "The Blossom Loft" \
    "A crisp minimalist urban apartment with a rooftop terrace overlooking the city skyline." \
    95 35.689487 139.691711 \
    "$WIFI_ID" "$ROOFTOP_ID" "$ESPRESSO_ID" "$CITYVIEW_ID")

PLACE3_ID=$(create_place "$KENJI_TOKEN" \
    "Fuji Retreat" \
    "A secluded cedar cabin at the foot of Mount Fuji with a private hot tub and forest trail access." \
    60 35.360627 138.727363 \
    "$WIFI_ID" "$FIREPLACE_ID" "$HOTTUB_ID" "$TRAIL_ID" "$BBQ_ID")

PLACE4_ID=$(create_place "$SOPHIE_TOKEN" \
    "Hanami Suite" \
    "A boutique hotel suite with floor-to-ceiling cherry blossom views, daily breakfast, and full spa access." \
    110 35.021041 135.753441 \
    "$WIFI_ID" "$CONCIERGE_ID" "$BREAKFAST_ID" "$SPA_ID")

PLACE5_ID=$(create_place "$HANA_TOKEN" \
    "Zen Garden Cottage" \
    "A peaceful countryside escape with a meditation garden and organic breakfasts served at sunrise." \
    45 34.693738 135.502165 \
    "$WIFI_ID" "$MEDITATION_ID" "$BICYCLE_ID" "$ORGANIC_ID")

PLACE6_ID=$(create_place "$LUCA_TOKEN" \
    "Momiji House" \
    "A traditional-modern fusion home with a sake bar, outdoor soaking bath, and a koi pond that glows at dusk." \
    75 34.385203 132.455293 \
    "$WIFI_ID" "$TATAMI_ID" "$SAKE_ID" "$BATH_ID" "$KOI_ID")

echo ""

# =============================================================
echo "── Step 6 · Reviews (logged in as each guest) ─"

MARIE_TOKEN=$(login  "marie@hbnb.com"  "guest123")
THOMAS_TOKEN=$(login "thomas@hbnb.com" "guest123")
AIKO_TOKEN=$(login   "aiko@hbnb.com"   "guest123")
JAMES_TOKEN=$(login  "james@hbnb.com"  "guest123")
ok "All guest tokens obtained"

echo ""
echo "  Sakura Villa ($PLACE1_ID):"
post_review "$MARIE_TOKEN"  "$PLACE1_ID" 5 "One of the most peaceful places I have ever stayed. The tea ceremony room made our evenings truly special."
post_review "$THOMAS_TOKEN" "$PLACE1_ID" 5 "The garden at sunrise is unforgettable. Heated floors were a lovely touch in the morning."
post_review "$AIKO_TOKEN"   "$PLACE1_ID" 4 "Beautifully designed, quiet, and close to nature. Yuki was a wonderful host."
post_review "$JAMES_TOKEN"  "$PLACE1_ID" 4 "A bit remote but that is exactly the point. Mountain view from the bedroom is stunning."

echo ""
echo "  The Blossom Loft ($PLACE2_ID):"
post_review "$MARIE_TOKEN"  "$PLACE2_ID" 5 "Sleek, stylish, and perfectly located. The rooftop at sunset is worth the price alone."
post_review "$THOMAS_TOKEN" "$PLACE2_ID" 5 "Everything was immaculate. Emma responded within minutes whenever we had a question."
post_review "$AIKO_TOKEN"   "$PLACE2_ID" 4 "Great espresso machine. I barely left the apartment on day one."

echo ""
echo "  Fuji Retreat ($PLACE3_ID):"
post_review "$MARIE_TOKEN"  "$PLACE3_ID" 5 "The hot tub under the stars with Fuji in the background is something I will never forget."
post_review "$THOMAS_TOKEN" "$PLACE3_ID" 5 "Cosy, quiet, and completely off-grid feeling. The fireplace made cold evenings magical."
post_review "$AIKO_TOKEN"   "$PLACE3_ID" 5 "Perfect escape from the city. The forest trail took us to a hidden waterfall."
post_review "$JAMES_TOKEN"  "$PLACE3_ID" 4 "Great for couples. Very private, very peaceful. BBQ area was a bonus."
post_review "$YUKI_TOKEN"   "$PLACE3_ID" 5 "Kenji left us detailed hiking maps. Such a thoughtful touch."

echo ""
echo "  Hanami Suite ($PLACE4_ID):"
post_review "$MARIE_TOKEN"  "$PLACE4_ID" 5 "The cherry blossom view from our bed was like sleeping inside a painting."
post_review "$THOMAS_TOKEN" "$PLACE4_ID" 5 "Breakfast was exceptional, fresh, local, and beautifully presented each morning."
post_review "$AIKO_TOKEN"   "$PLACE4_ID" 5 "Spa access made this feel like a true luxury retreat. Would return every spring."
post_review "$JAMES_TOKEN"  "$PLACE4_ID" 5 "Concierge arranged a private garden tour we could not have found on our own."
post_review "$YUKI_TOKEN"   "$PLACE4_ID" 4 "Slightly expensive but absolutely worth every yen."
post_review "$EMMA_TOKEN"   "$PLACE4_ID" 5 "Flawless. The best accommodation I have had in Japan."

echo ""
echo "  Zen Garden Cottage ($PLACE5_ID):"
post_review "$MARIE_TOKEN"  "$PLACE5_ID" 5 "I came burnt out and left genuinely restored. The meditation garden did something to me."
post_review "$THOMAS_TOKEN" "$PLACE5_ID" 5 "Organic breakfast at sunrise on the porch is the stuff of dreams."

echo ""
echo "  Momiji House ($PLACE6_ID):"
post_review "$MARIE_TOKEN"  "$PLACE6_ID" 5 "The outdoor bath by the koi pond at night is an experience unlike anything else."
post_review "$THOMAS_TOKEN" "$PLACE6_ID" 5 "Sake bar selection was surprisingly excellent. Luca clearly knows his rice wine."
post_review "$AIKO_TOKEN"   "$PLACE6_ID" 5 "Tatami room was so comfortable. I slept better than I have in years."
post_review "$JAMES_TOKEN"  "$PLACE6_ID" 4 "A perfect blend of traditional and modern. Every detail was intentional."

# =============================================================
echo ""
echo "══════════════════════════════════════════"
echo "   Seeding complete — verifying results"
echo "══════════════════════════════════════════"
echo ""

curl -s "$API/places/" | python3 - <<'PYEOF'
import sys, json
places = json.load(sys.stdin)
print(f"  {len(places)} places in database:\n")
for p in places:
    amenity_names = [a['name'] for a in p.get('amenities', [])]
    print(f"  • {p['title']}")
    print(f"    owner : {p['owner']['first_name']} {p['owner']['last_name']}")
    print(f"    coords: {p['latitude']}, {p['longitude']}")
    amenity_str = ', '.join(amenity_names) if amenity_names else 'none'
    print(f"    amens : {amenity_str}")
    print()
PYEOF
