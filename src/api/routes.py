"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Alumno
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_mail import Message
from flask import current_app
from flask_bcrypt import check_password_hash, generate_password_hash
from sqlalchemy import select

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


# esto hay que hacerlo con fetch
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


@api.route('/registro-estudiante/<int:id>', methods=['PUT'])
def editando_estudiante(id):
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email:
        return jsonify({"msg": "Email requerido"}), 400

    # peticion de un estudiante por ID
   
    estudiante = db.session.execute(select(Alumno).where(Alumno.id == id)).scalar_one_or_none()
    if not estudiante:
         return jsonify({"msg": "alumnno no enecontrado"}), 400
    
    if email:
        estudiante.email=email

    if password:
        estudiante.password_hash= generate_password_hash(password)
  
   # actualizar los datos
    db.session.commit()


 
    # enviar mail con las credenciales
    msg = Message(
        subject="actualizacion de datos de acceso a la plataforma",
        recipients=[email],
        body=f"""
                Tus datos de acceso han sido enviados por tu profesor.

                Email: {estudiante.email}
                Password: {password}

                Puedes iniciar sesión en la plataforma.
            """
    )
    current_app.extensions['mail'].send(msg)

    return jsonify({"msg": "Email enviado"}), 200
