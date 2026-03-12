"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Profesor, Alumno,Salon, Calificacion
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_mail import Message
from flask import current_app
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_jwt
from flask_bcrypt import generate_password_hash
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


@api.route('/profesor/registro',methods=['POST'])
def profesor_registro():
 data= request.get_json()
 nombre= data.get('nombre')
 email= data.get('email')
 password=data.get('password')

 if not nombre or not email or not password:
    return jsonify({"msg":"Rellenar todos los campos para completar el registro"}),400
 
 existing_user= db.session.execute(select(Profesor).where(Profesor.email == email)).scalar_one_or_none()
 if existing_user:
        return jsonify({'msg': 'Un perfil de profesor con este correo electrócnico ya existe'}), 409

 new_user = Profesor(nombre=nombre,email=email)
 new_user.set_password(password)
 db.session.add(new_user)
 db.session.commit()
 return jsonify({'msg': 'El perfil de profesor ha sido creado satisfactoriamente'}), 200


@api.route('profesor/login', methods=['POST'])
def login_profesor():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'msg': 'El correo electrónico y password son requeridos'}), 400
    
    existing_user = db.session.execute(select(Profesor).where(Profesor.email == email)).scalar_one_or_none()
    
    if existing_user is None:
        return jsonify({'msg': 'El correo eletrónico o password son incorrectos'}), 401
    
    if existing_user.check_password(password):
        access_token = create_access_token(identity=str(existing_user.id))
        return jsonify({'msg': 'Inicio de sesión exitoso', 'token': access_token, 'existing_user': existing_user.serialize()}), 200
    else:
        return jsonify({'msg': 'El correo eletrócnico o password son incorrectos'}), 401


@api.route('perfil/profesor', methods=['GET'])
@jwt_required()
def perfil_profesor():
    existing_user_id = get_jwt_identity()
    existing_user = db.session.get(Profesor, int(existing_user_id))
    if not existing_user:
        return jsonify({"msg": "Usuario no encontrado"}), 400
    return jsonify(existing_user.serialize()), 200



@api.route('/alumno/registro', methods=['POST'])
@jwt_required()
def estudiante_registro():
     existing_user_id= get_jwt_identity()
     profesor= db.session.get(Profesor,int(existing_user_id))

     if not profesor:
        return jsonify({'msg':'Usuario no autorizado'}),400
   
     data= request.get_json()
    
     if not data:
      return jsonify({"msg":"Datos inválidos"}),404
     
     salon_id= data.get("salon_id")
     if not salon_id:
         return jsonify({"msg":"salon_id es requerido"}),404
     
     
     salon= db.session.get(Salon,salon_id)

     if not salon:
         return jsonify({"msg":"Salon no encontrado"}),404
     
     if salon.profesor_id != profesor.id:
         return jsonify({"msg":"Este salon no es tuyo"}),404
         
     alumno_email = data.get("email")
     alumno_password = data.get("password")
     new_user= Alumno(
         nombre=data.get("nombre"),
         email=alumno_email, 
        #  ,
         salon_id=salon_id
     )
     new_user.set_password(data.get("password"))
  
     db.session.add(new_user)
     db.session.commit()

     # enviar mail con las credenciales
     msg = Message(
        subject="actualizacion de datos de acceso a la plataforma",
        recipients=[alumno_email],
        body=f"""
                Tus datos de acceso han sido enviados por tu profesor.

                Email: {alumno_email}
                Password: {alumno_password}

                Puedes iniciar sesión en la plataforma.
            """
    )
     current_app.extensions['mail'].send(msg)

     return jsonify({"msg": "Email enviado"}), 200 

#verificacion de token en todo momento, back y layout
@api.route("/get_user", methods=["GET"])
@jwt_required()
def get_user():
    user_id= get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({"msg":"usuario no encontrado"}),400
    return jsonify(user.serialize()),200


####AÑADIR JWT PARA COMPROBAR QUE EL ALUMNO ES EL ALUMNO CORRECTO Y QUITAR EL ID DE LA URL
@api.route('/registro-estudiante', methods=['PUT'])
@jwt_required()
def editando_password_estudiante():

    existing_user_id = get_jwt_identity()
    existing_user = db.session.get(Alumno, int(existing_user_id))
    if not existing_user:
        return jsonify({"msg": "Usuario no encontrado"}), 400
 

    data = request.get_json()
    
    password = data.get("password")

    if not password:
        return jsonify({"msg": "Contraseña requerida"}), 400
    
    existing_user.set_password(password)
  
   # actualizar los datos
    db.session.commit()
    return jsonify({"msg": "todoo ok"}), 200
  
  

@api.route('/alumno/login',methods=['POST'])
def login_estudiante():
     data = request.get_json()
     email = data.get('email')
     password_hash = data.get('password_hash')
     if not email or not password_hash:
        return jsonify({'msg': 'El correo electrónico y password son requeridos'}), 400
    
     existing_user = db.session.execute(select(Alumno).where(Alumno.email == email)).scalar_one_or_none()
    
     if existing_user is None:
        return jsonify({'msg': 'El correo eletrócnico o password son incorrectos'}), 401
    
     if existing_user.check_password(password_hash):
        access_token = create_access_token(identity=str(existing_user.id))
        return jsonify({'msg': 'Inicio de sesión exitoso', 'token': access_token, 'existing_user': existing_user.serialize()}), 200
     else:
        return jsonify({'msg': 'El correo eletrócnico o password son incorrectos'}), 401


@api.route('perfil/alumno', methods=['GET'])
@jwt_required()
def perfil_estudiante():
    existing_user_id = get_jwt_identity()
    existing_user = db.session.get(Alumno, int(existing_user_id))
    if not existing_user:
        return jsonify({"msg": "Usuario no encontrado"}), 400
    return jsonify(existing_user.serialize()), 200


@api.route('calificaciones/crear', methods=['POST'])
@jwt_required()
def crear_calificaciones():
    existing_user_id= get_jwt_identity()
    profesor= db.session.get(Profesor,int(existing_user_id))

    if not profesor:
        return jsonify({"msg":"Usuario no autorizado"}),401

    data= request.get_json()

    if not data:
        return jsonify({"msg":"Datos Inválidos"}),400

    alumno_id= data.get("alumno_id")
    alumno= db.session.get(Alumno,alumno_id)

    if not alumno:
        return jsonify({"msg": "Estudiante no encontrado"}), 404
   
    
    salon_materia = data.get("salon_materia_id")

    if not salon_materia:
        return jsonify({"msg":"Esta materia no pertence a este salon de clases"})
    
    
    salones_profesor= [salon.id for salon in profesor.salones]
    salon_alumno = alumno.salon_id

    if salon_alumno not in salones_profesor:
       return jsonify({"msg": "Este estudiante no está es ninguna de tus aulas"}), 403
    
    
    
    nueva_calificacion= Calificacion(
        nota= data.get("nota"),
        salon_materia_id=data.get("salon_materia_id"),
        alumno_id=alumno_id,
        profesor_id= existing_user_id
    )

    db.session.add(nueva_calificacion)
    db.session.commit()

    return jsonify(nueva_calificacion.serialize()),201
