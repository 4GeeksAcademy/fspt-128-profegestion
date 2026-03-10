"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_mail import Message
from flask import current_app

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


##esto hay que hacerlo con fetch
@api.route('/send-email', methods=['POST'])
def send_email():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"msg": "Email requerido"}), 400
    msg = Message(
        subject="Test Mailtrap",
        recipients=[email],
        body="Este es un email de prueba enviado desde Flask." 
    )
    current_app.extensions['mail'].send(msg)

    return jsonify({"msg": "Email enviado"}), 200
