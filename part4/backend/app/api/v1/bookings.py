#!/usr/bin/python3
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services import facade

api = Namespace('bookings', description='Booking operations')

booking_model = api.model('Booking', {
    'place_id': fields.String(required=True, description='Place ID'),
    'date': fields.String(required=True, description='Requested date (YYYY-MM-DD)')
})

status_model = api.model('BookingStatus', {
    'status': fields.String(
        required=True, description='approved or denied')
})


def _is_admin():
    return get_jwt().get("is_admin", False)


def _serialize(b):
    place = b.place
    user = b.user
    return {
        "id": b.id,
        "place_id": b.place_id,
        "place_title": place.title if place else None,
        "user_id": b.user_id,
        "user_name": (
            f"{user.first_name} {user.last_name}"
            if user and not user.is_deleted else "Deleted User"
        ),
        "date": b.date,
        "status": b.status,
        "owner_seen": b.owner_seen,
        "guest_seen": b.guest_seen,
        "created_at": b.created_at.isoformat() if b.created_at else None
    }


@api.route('/')
class BookingList(Resource):
    @jwt_required()
    @api.doc(security='Bearer Auth')
    @api.expect(booking_model, validate=True)
    @api.response(201, 'Booking request created')
    @api.response(400, 'Invalid input')
    @api.response(403, 'Cannot book your own place')
    def post(self):
        """Request a booking for a place"""
        current_user = get_jwt_identity()
        place_id = api.payload.get('place_id')
        date = api.payload.get('date')

        place = facade.get_place(place_id)
        if not place:
            return {"error": "Place not found"}, 404
        if place.owner.id == current_user:
            return {"error": "You cannot book your own place"}, 403

        booking = facade.create_booking(place_id, current_user, date)
        return _serialize(booking), 201

    @jwt_required()
    @api.doc(security='Bearer Auth')
    @api.response(200, 'Bookings retrieved')
    def get(self):
        """Get bookings relevant to the current user"""
        current_user = get_jwt_identity()

        # Bookings I requested
        my_bookings = [
            _serialize(b)
            for b in facade.get_bookings_by_user(current_user)
        ]

        # Bookings on my places (owner view)
        my_places = [
            p for p in facade.get_all_places()
            if p.owner and p.owner.id == current_user
        ]
        place_bookings = []
        for place in my_places:
            for b in facade.get_bookings_for_place(place.id):
                place_bookings.append(_serialize(b))

        return {
            "my_requests": my_bookings,
            "my_place_bookings": place_bookings
        }, 200


@api.route('/notifications')
class BookingNotifications(Resource):
    @jwt_required()
    @api.doc(security='Bearer Auth')
    def get(self):
        """Get unread notifications for the current user"""
        current_user = get_jwt_identity()

        # Guest notifications: status changed and not yet seen
        guest_notifs = [
            _serialize(b)
            for b in facade.get_bookings_by_user(current_user)
            if not b.guest_seen and b.status != 'pending'
        ]

        # Owner notifications: new pending bookings not yet seen
        my_places = [
            p for p in facade.get_all_places()
            if p.owner and p.owner.id == current_user
        ]
        owner_notifs = []
        for place in my_places:
            for b in facade.get_bookings_for_place(place.id):
                if not b.owner_seen and b.status == 'pending':
                    owner_notifs.append(_serialize(b))

        return {
            "guest": guest_notifs,
            "owner": owner_notifs
        }, 200


@api.route('/<booking_id>')
class BookingResource(Resource):
    @jwt_required()
    @api.doc(security='Bearer Auth')
    @api.expect(status_model, validate=True)
    @api.response(200, 'Booking updated')
    @api.response(403, 'Unauthorized')
    @api.response(404, 'Not found')
    def put(self, booking_id):
        """Approve or deny a booking (place owner only)"""
        current_user = get_jwt_identity()
        booking = facade.get_booking(booking_id)
        if not booking:
            return {"error": "Booking not found"}, 404

        place = facade.get_place(booking.place_id)
        if not place or (
            place.owner.id != current_user and not _is_admin()
        ):
            return {"error": "Unauthorized"}, 403

        status = api.payload.get('status')
        if status not in ('approved', 'denied'):
            return {"error": "Status must be approved or denied"}, 400

        updated = facade.update_booking_status(booking_id, status)
        return _serialize(updated), 200


@api.route('/<booking_id>/seen')
class BookingSeen(Resource):
    @jwt_required()
    @api.doc(security='Bearer Auth')
    @api.response(200, 'Marked as seen')
    def put(self, booking_id):
        """Mark a booking notification as seen"""
        current_user = get_jwt_identity()
        booking = facade.get_booking(booking_id)
        if not booking:
            return {"error": "Booking not found"}, 404

        if booking.user_id == current_user:
            facade.mark_guest_seen(booking_id)
        else:
            place = facade.get_place(booking.place_id)
            if place and place.owner.id == current_user:
                facade.mark_owner_seen(booking_id)

        return {"message": "Marked as seen"}, 200
