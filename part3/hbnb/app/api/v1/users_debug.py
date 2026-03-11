from flask_restx import Namespace, Resource, fields
from app.services import facade

api_debug = Namespace('users-debug', description='Debug user password operations')

password_model = api_debug.model('PasswordCheck', {
    'password': fields.String(required=True, description='Password to verify')
})

@api_debug.route('/<user_id>/hash')
class UserHash(Resource):
    def get(self, user_id):
        """Get hashed password of a user (debug only)"""
        user = facade.get_user(user_id)
        if not user:
            return {"error": "User not found"}, 404
        return {"password_hash": user._password}, 200


@api_debug.route('/<user_id>/verify')
class UserVerify(Resource):
    @api_debug.expect(password_model, validate=True)
    def post(self, user_id):
        """Verify a password against the stored hash"""
        user = facade.get_user(user_id)
        if not user:
            return {"error": "User not found"}, 404

        password = api_debug.payload['password']
        result = user.verify_password(password)
        return {"valid": result}, 200
