"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import smtplib
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Profesor, Alumno, Salon, Calificacion, Materia, SalonMateria
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_mail import Message
from flask import current_app
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
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


@api.route('/profesor/registro', methods=['POST'])
def profesor_registro():
    data = request.get_json()
    nombre = data.get('nombre')
    email = data.get('email')
    password = data.get('password')

    if not nombre or not email or not password:
        return jsonify({"msg": "Rellenar todos los campos para completar el registro"}), 400

    existing_user = db.session.execute(select(Profesor).where(
        Profesor.email == email)).scalar_one_or_none()
    if existing_user:
        return jsonify({'msg': 'Un perfil de profesor con este correo electrócnico ya existe'}), 409

    new_user = Profesor(nombre=nombre, email=email)
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

    existing_user = db.session.execute(select(Profesor).where(
        Profesor.email == email)).scalar_one_or_none()

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


# CRUD DE ALUMNO

@api.route('/alumno/registro', methods=['POST'])
@jwt_required()
def estudiante_registro():
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({'msg': 'Usuario no autorizado'}), 401

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Datos inválidos"}), 400

    salon_id = data.get("salon_id")
    if not salon_id:
        return jsonify({"msg": "salon_id es requerido"}), 400

    salon = db.session.get(Salon, salon_id)
    if not salon:
        return jsonify({"msg": "Salón no encontrado"}), 404

    if salon.profesor_id != profesor.id:
        return jsonify({"msg": "Este salón no es tuyo"}), 403

    nombre = data.get("nombre")
    alumno_email = data.get("email")
    alumno_password = data.get("password")

    if not nombre or not alumno_email or not alumno_password:
        return jsonify({"msg": "nombre, email y password son requeridos"}), 400

    existing_alumno = db.session.execute(
        select(Alumno).where(Alumno.email == alumno_email)
    ).scalar_one_or_none()

    if existing_alumno:
        return jsonify({"msg": "Ya existe un alumno con ese email"}), 409

    new_user = Alumno(
        nombre=nombre,
        email=alumno_email,
        salon_id=salon_id
    )
    new_user.set_password(alumno_password)

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.exception("Error guardando alumno")
        return jsonify({"msg": "No se pudo registrar el alumno"}), 500

    email_enviado = False

    try:
        msg = Message(
            subject="Actualización de datos de acceso a la plataforma",
            recipients=[alumno_email],
            body=f"""
    Tus datos de acceso han sido enviados por tu profesor.

    Email: {alumno_email}
    Password: {alumno_password}

    Puedes iniciar sesión en la plataforma.
            """
        )
        current_app.extensions['mail'].send(msg)
        email_enviado = True

    except smtplib.SMTPException as e:
        current_app.logger.error(f"Error SMTP enviando correo al alumno: {e}")
        current_app.logger.exception("Detalle del error SMTP")
    except Exception as e:
        current_app.logger.error(
            f"Error inesperado enviando correo al alumno: {e}")
        current_app.logger.exception("Detalle del error inesperado")

    if email_enviado:
        return jsonify({
            "msg": "Alumno registrado y email enviado correctamente",
            "alumno": new_user.serialize()
        }), 201

    return jsonify({
        "msg": "Alumno registrado, pero no se pudo enviar el email",
        "alumno": new_user.serialize(),
        "email_enviado": False
    }), 201

# verificacion de token en todo momento, back y layout

# REIVSAR PARA QUE VERIFIQUE TANTO PARA PROFESOR COMO PARA ALUMNO
# NO HAY MODELO USER HAY PROFESOR Y ALUMNO


@api.route("/get_user", methods=["GET"])
@jwt_required()
def get_user():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))

    if not user:
        return jsonify({"msg": "usuario no encontrado"}), 400
    return jsonify(user.serialize()), 200


# AÑADIR JWT PARA COMPROBAR QUE EL ALUMNO ES EL ALUMNO CORRECTO Y QUITAR EL ID DE LA URL
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


@api.route('/alumno/login', methods=['POST'])
def login_estudiante():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'msg': 'El correo electrónico y password son requeridos'}), 400

    existing_user = db.session.execute(select(Alumno).where(
        Alumno.email == email)).scalar_one_or_none()

    if existing_user is None:
        return jsonify({'msg': 'El correo eletrócnico o password son incorrectos'}), 401

    if existing_user.check_password(password):
        access_token = create_access_token(identity=str(existing_user.id))
        return jsonify({
            'msg': 'Inicio de sesión exitoso',
            'token': access_token,
            'existing_user': existing_user.serialize(),
            "must_change_password": existing_user.must_change_password
        }), 200
    else:
        return jsonify({'msg': 'El correo eletrócnico o password son incorrectos'}), 401


@api.route('alumno/change-password', methods=["PUT"])
@jwt_required()
def change_password_alumno():
    alumno_id = get_jwt_identity()
    data = request.get_json()

    new_password = data.get("new_password")

    alumno = db.session.get(Alumno, int(alumno_id))
    if alumno is None:
        return jsonify({"msg": "Alumno no encontrado"}), 404

    alumno.set_password(new_password)
    alumno.must_change_password = False
    db.session.commit()

    return jsonify({
        "msg": "Contraseña actualizada correctamente",
        "user": alumno.serialize()
    })


@api.route('/alumno/editar/<int:alumno_id>', methods=['PUT'])
@jwt_required()
def editar_estudiante(alumno_id):
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Datos Inválidos"}), 400

    alumno_email = data.get("email")
    alumno = db.session.get(Alumno, alumno_id)

    if not alumno:
        return jsonify({"msg": "Alumno innexistente"}), 400

    salones_profesor = [salon.id for salon in profesor.salones]

    if alumno.salon_id not in salones_profesor:
        return ({"msg": "El alumno no pertenece a este salon"}), 400

    if alumno_email != alumno.email:
        existe = db.session.execute(
            select(Alumno).where(Alumno.email == "email")).first()

        if existe:
            return jsonify({"msg": "El correo electrónico ya está en uso"}), 401

    if "nombre" in data:
        alumno.nombre = data["nombre"]

    if "email" in data:
        alumno.email = data["email"]

    return jsonify(alumno.serialize()), 200


@api.route('/alumno/eliminar/<int:alumno_id>', methods=['DELETE'])
@jwt_required()
def eliminar_estudiante(alumno_id):
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    alumno = db.session.get(Alumno, alumno_id)

    if not alumno:
        return jsonify({"msg": "Alumno innexistente"}), 400

    db.session.delete(alumno)
    db.session.commit()

    return jsonify({"msg": "El alumno ha sido borrado exitosamente"}), 200


@api.route('/alumnos/lista', methods=['GET'])
@jwt_required()
def alumno_calificaciones():
    existing_user_id = get_jwt_identity()
    existing_user = db.session.get(Profesor, int(existing_user_id))
    if not existing_user:
        return jsonify({"msg": "Usuario no encontrado"}), 400

    salones_ids = [salon.id for salon in existing_user.salones]

    alumnos = db.session.execute(select(Alumno).where(
        Alumno.salon_id.in_(salones_ids))).scalars().all()

    return jsonify([alumno.serialize() for alumno in alumnos]), 200


@api.route('perfil/alumno', methods=['GET'])
@jwt_required()
def perfil_estudiante():
    alumno_id = get_jwt_identity()

    alumno = Alumno.query.filter_by(id=alumno_id).first()

    if not alumno:
        return jsonify({"msg": "Alumno no encontrado"}), 404

    salon = Salon.query.filter_by(id=alumno.salon_id).first()

    profesor = Profesor.query.filter_by(
        id=salon.profesor_id).first() if salon else None

    materias_salon = SalonMateria.query.filter_by(salon_id=salon.id).all()
    materias = [sm.materia.serialize() for sm in materias_salon]

    calificaciones = Calificacion.query.filter_by(alumno_id=alumno.id).all()

    return jsonify({
        **alumno.serialize(),

        "salon": {
            **salon.serialize(),
            "profesor": profesor.serialize() if profesor else None,
            "materias": materias
        } if salon else None,

        "calificaciones": [c.serialize() for c in calificaciones]
    }), 200


# CURD DE CALIFICACIONES

@api.route('calificaciones/crear', methods=['POST'])
@jwt_required()
def crear_calificaciones():
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Datos Inválidos"}), 400
    print({"DATA": data})
    alumno_id = data.get("alumno_id")
    alumno = db.session.get(Alumno, alumno_id)

    if not alumno:
        return jsonify({"msg": "Estudiante no encontrado"}), 404

    salon_materia = data.get("salon_materia_id")

    if not salon_materia:
        return jsonify({"msg": "Esta materia no pertence a este salon de clases"})

    salones_profesor = [salon.id for salon in profesor.salones]
    salon_alumno = alumno.salon_id

    if salon_alumno not in salones_profesor:
        return jsonify({"msg": "Este estudiante no está es ninguna de tus aulas"}), 403

    nueva_calificacion = Calificacion(
        nota=data.get("nota"),
        salon_materia_id=data.get("salon_materia_id"),
        alumno_id=alumno_id,
        profesor_id=existing_user_id
    )

    db.session.add(nueva_calificacion)
    db.session.commit()

    return jsonify(nueva_calificacion.serialize()), 201


@api.route('calificaciones/editar/<int:calificacion_id>', methods=['PUT'])
@jwt_required()
def editar_calificaciones(calificacion_id):
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    calificacion = db.session.get(Calificacion, calificacion_id)

    if not calificacion:
        return ({"msg": "Calificacion no encontrada"})

    alumno = db.session.get(Alumno, calificacion.alumno_id)

    if not alumno:
        return jsonify({"msg": "Alumno no encontrado"})

    salones_profesor = [salon.id for salon in profesor.salones]
    salon_alumno = alumno.salon_id

    if salon_alumno not in salones_profesor:
        return jsonify({"msg": "Este estudiante no está es ninguna de tus aulas"}), 403

    data = request.get_json()

    if not data:
        return jsonify({"msg": "Datos Inválidos"}), 400

    if "nota" in data:
        calificacion.nota = data["nota"]

    db.session.commit()

    return jsonify(calificacion.serialize()), 200


@api.route('calificaciones/eliminar/<int:calificacion_id>', methods=['DELETE'])
@jwt_required()
def eliminar_calificaciones(calificacion_id):
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    calificacion = db.session.get(Calificacion, calificacion_id)

    if not calificacion:
        return ({"msg": "Calificacion no encontrada"})

    alumno = db.session.get(Alumno, calificacion.alumno_id)

    if not alumno:
        return jsonify({"msg": "Alumno no encontrado"})

    salones_profesor = [salon.id for salon in profesor.salones]
    salon_alumno = alumno.salon_id

    if salon_alumno not in salones_profesor:
        return jsonify({"msg": "Este estudiante no está es ninguna de tus aulas"}), 403

    db.session.delete(calificacion)
    db.session.commit()

    return jsonify({"msg": "La calificacion ha sido borrada correctamente"}), 200


# CRUD DE SALON

@api.route('/salones/lista', methods=['GET'])
@jwt_required()
def salones_lista():
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    salones = profesor.salones

    return jsonify([salon.serialize() for salon in salones]), 200


@api.route('/salon/crear', methods=['POST'])
@jwt_required()
def crear_salon():
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    data = request.get_json()
    if not data:
        return ({"msg": "Datos inválidos"}), 400

    salon_id = data.get("salon_id")
    salon = db.session.get(Salon, salon_id)

    nombre_salon = data.get("nombre")
    salones_profesor = [salon.nombre for salon in profesor.salones]

    if nombre_salon is None:
        return jsonify({"msg": "El nombre del salon es requerido"}), 400

    if nombre_salon in salones_profesor:
        return jsonify({"msg": "Ya existe un salon con este nombre"}), 400

    classroom = Salon(
        nombre=nombre_salon,
        profesor_id=existing_user_id
    )

    db.session.add(classroom)
    db.session.commit()

    return jsonify({"msg": "El salon ha sido creado exitosamente"}), 200


@api.route('/salon/editar/<int:salon_id>', methods=['PUT'])
@jwt_required()
def editar_salon(salon_id):
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    data = request.get_json()

    if not data:
        return ({"msg": "Datos inválidos"}), 400

    salon = db.session.get(Salon, salon_id)

    nombre_salon = data.get("nombre")
    salones_profesor = [salon.nombre for salon in profesor.salones]

    if nombre_salon is None:
        return jsonify({"msg": "El nombre del salon es requerido"}), 400

    if nombre_salon in salones_profesor:
        return jsonify({"msg": "Ya existe un salon con este nombre"}), 400

    if "nombre" in data:
        salon.nombre = data["nombre"]

    db.session.commit()
    return jsonify(salon.serialize()), 200


@api.route('salon/eliminar/<int:salon_id>', methods=['DELETE'])
@jwt_required()
def eliminar_salon(salon_id):
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    salon = db.session.get(Salon, salon_id)

    if not salon:
        return ({"msg": "Calificacion no encontrada"}), 400

    if salon.profesor_id != profesor.id:
        return jsonify({"msg": "Ya existe un salon con este nombre"}), 400

    db.session.delete(salon)
    db.session.commit()

    return jsonify({"msg": "El salon ha sido borrado exitosamente"}), 200


# CRUD DE MATERIAS

@api.route('/materias/crear', methods=['POST'])
@jwt_required()
def crear_materias():
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    data = request.get_json()
    if not data:
        return ({"msg": "Datos inválidos"}), 400
    print(data)
    nombre_materia = data.get("nombre")
    salon_id = data.get("salon_id")

    if nombre_materia is None:
        return jsonify({"msg": "El nombre de la materia es requerido"})

    if salon_id is None:
        return jsonify({"msg": "El id del salon es requerido"}), 400

    salon = db.session.get(Salon, salon_id)
    if not salon:
        return jsonify({"msg": "El salon no existe"}), 400

    materia_existente = db.session.execute(select(Materia).where(
        Materia.nombre == nombre_materia)).scalar_one_or_none()

    if materia_existente:
        return jsonify({"msg": "Ya existe una materia con este nombre"}), 400

    materia = Materia(
        nombre=nombre_materia
    )

    db.session.add(materia)
    db.session.flush()

    asignacion_existente = db.session.execute(
        select(SalonMateria).where(
            SalonMateria.salon_id == salon_id,
            SalonMateria.materia_id == materia.id
        )
    ).scalar_one_or_none()

    if asignacion_existente:
        return jsonify({"msg": "La materia ya esta asignada a este salon"}), 400

    nueva_asignacion = SalonMateria(
        salon_id=salon_id,
        materia_id=materia.id
    )

    db.session.add(nueva_asignacion)
    db.session.commit()
    return jsonify(
        {
            "msg": "La materia ha sido creado exitosamente",
            "materia": materia.serialize(),
            "asignacion": nueva_asignacion.serialize()
        }
    ), 201


@api.route('/materias/editar/<int:materia_id>', methods=['PUT'])
@jwt_required()
def editar_materias(materia_id):
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    data = request.get_json()
    if not data:
        return ({"msg": "Datos inválidos"}), 400

    materia = db.session.get(Materia, materia_id)

    nombre_materia = data.get("nombre")

    if nombre_materia is None:
        return jsonify({"msg": "El nombre de la materia es requerido"})

    materia_existente = db.session.execute(
        select(Materia).where(Materia.nombre == "nombre")).first()

    if materia_existente:
        return jsonify({"msg": "Ya existe una materia con este nombre"}), 400

    if "nombre" in data:
        materia.nombre = data["nombre"]

    db.session.commit()

    return jsonify(materia.serialize()), 200


@api.route('materias/eliminar/<int:materia_id>', methods=['DELETE'])
@jwt_required()
def eliminar_materia(materia_id):
    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    materia = db.session.get(Materia, materia_id)

    if not materia:
        return jsonify({"msg": "Materia inexistente"}), 400

    db.session.delete(materia)
    db.session.commit()

    return jsonify({"msg": "La materia ha sido borrada exitosamente"}), 200


@api.route('/materias/lista', methods=['GET'])
@jwt_required()
def materias_lista():

    existing_user_id = get_jwt_identity()
    profesor = db.session.get(Profesor, int(existing_user_id))

    if not profesor:
        return jsonify({"msg": "Usuario no autorizado"}), 401

    salones_ids = [salon.id for salon in profesor.salones]

    salon_materias = db.session.execute(
        select(SalonMateria).where(SalonMateria.salon_id.in_(salones_ids))
    ).scalars().all()

    materias = [
        {
            "id": sm.materia.id,
            "nombre": sm.materia.nombre,
            "salon_id": sm.salon_id,
            "materia_id": sm.materia_id,
            "salon_materia_id": sm.id
        }
        for sm in salon_materias
    ]
    return jsonify(materias), 200


# Endpint alumnos con sus calificaciones.
@api.route('/alumnos/calificaciones', methods=["GET"])
@jwt_required()
def alumnos_calificaciones():
    existing_user_id = get_jwt_identity()
    existing_user = db.session.get(Profesor, int(existing_user_id))

    if not existing_user:
        return jsonify({"msg": "Usuario no encontrado"}), 400

    salones_ids = [salon.id for salon in existing_user.salones]

    if not salones_ids:
        return jsonify([]), 200

    alumnos = db.session.execute(
        select(Alumno).where(Alumno.salon_id.in_(salones_ids))
    ).scalars().all()

    resultado = []

    for alumno in alumnos:
        if not alumno.salon:
            resultado.append({
                "id": f"{alumno.id}-sin-materia",
                "alumno_id": alumno.id,
                "alumno": alumno.nombre,
                "materia": None,
                "nota": None
            })
            continue
        for salon_materia in alumno.salon.materias_asignadas:
            calificacion = db.session.execute(
                select(Calificacion).where(
                    Calificacion.alumno_id == alumno.id,
                    Calificacion.salon_materia_id == salon_materia.id
                )
            ).scalar_one_or_none()

            resultado.append({
                "id": f"{alumno.id}-{salon_materia.id}",
                "alumno_id": alumno.id,
                "alumno": alumno.nombre,
                "materia": salon_materia.materia.nombre,
                "nota": calificacion.nota if calificacion else None
            })

    return jsonify(resultado), 200
