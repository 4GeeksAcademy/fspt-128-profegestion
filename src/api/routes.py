"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Profesor, Alumno,Salon, Calificacion, Materia
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






#CRUD DE ALUMNO

@api.route('/alumno/registro', methods=['POST'])
@jwt_required()
def estudiante_registro():
     existing_user_id= get_jwt_identity()
     profesor= db.session.get(Profesor,int(existing_user_id))

     if not profesor:
        return jsonify({'msg':'Usuario no autorizado'}),400
   
     data= request.get_json()
    
     if not data:
      return jsonify({"msg":"Datos inválidos"}),414
     
     salon_id= data.get("salon_id")
     if not salon_id:
         return jsonify({"msg":"salon_id es requerido"}),424
     
     
     salon= db.session.get(Salon,salon_id)

     if not salon:
         return jsonify({"msg":"Salon no encontrado"}),434
     
     if salon.profesor_id != profesor.id:
         return jsonify({"msg":"Este salon no es tuyo"}),444
         
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

#REIVSAR PARA QUE VERIFIQUE TANTO PARA PROFESOR COMO PARA ALUMNO
#NO HAY MODELO USER HAY PROFESOR Y ALUMNO
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
     password = data.get('password')
     if not email or not password:
        return jsonify({'msg': 'El correo electrónico y password son requeridos'}), 400
    
     existing_user = db.session.execute(select(Alumno).where(Alumno.email == email)).scalar_one_or_none()
    
     if existing_user is None:
        return jsonify({'msg': 'El correo eletrócnico o password son incorrectos'}), 401
    
     if existing_user.check_password(password):
        access_token = create_access_token(identity=str(existing_user.id))
        return jsonify({
            'msg': 'Inicio de sesión exitoso', 
            'token': access_token, 
            'existing_user': existing_user.serialize(), 
            "must_change_password" : existing_user.must_change_password
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


@api.route('/alumno/editar/<int:alumno_id>',methods=['PUT'])
@jwt_required()
def editar_estudiante(alumno_id):
     existing_user_id= get_jwt_identity()
     profesor= db.session.get(Profesor,int(existing_user_id))

     if not profesor:
        return jsonify({"msg":"Usuario no autorizado"}),401

     data= request.get_json()

     if not data:
        return jsonify({"msg":"Datos Inválidos"}),400
     
     alumno_email=data.get("email")
     alumno=db.session.get(Alumno,alumno_id)
     
     if not alumno:
         return jsonify({"msg":"Alumno innexistente"}),400
     
     salones_profesor= [salon.id for salon in profesor.salones]

     if alumno.salon_id not in salones_profesor:
         return ({"msg":"El alumno no pertenece a este salon"}),400
     
     if alumno_email != alumno.email:
         existe= db.session.execute(select(Alumno).where(Alumno.email == "email")).first()

         if existe:
          return jsonify({"msg":"El correo electrónico ya está en uso"}),401
     

     
     if "nombre" in data:
         alumno.nombre=data["nombre"]

     if "email" in data:
         alumno.email=data["email"]


     return jsonify(alumno.serialize()),200

@api.route('/alumno/eliminar/<int:alumno_id>',methods=['DELETE'])
@jwt_required()
def eliminar_estudiante(alumno_id):
     existing_user_id= get_jwt_identity()
     profesor= db.session.get(Profesor,int(existing_user_id))

     if not profesor:
        return jsonify({"msg":"Usuario no autorizado"}),401
     
     
     alumno=db.session.get(Alumno,alumno_id)
     
     if not alumno:
         return jsonify({"msg":"Alumno innexistente"}),400
     
     db.session.delete(alumno)
     db.session.commit()

     return jsonify({"msg":"El alumno ha sido borrado exitosamente"}),200

     

@api.route('perfil/alumno', methods=['GET'])
@jwt_required()
def perfil_estudiante():
    existing_user_id = get_jwt_identity()
    existing_user = db.session.get(Alumno, int(existing_user_id))
    if not existing_user:
        return jsonify({"msg": "Usuario no encontrado"}), 400
    return jsonify(existing_user.serialize()), 200









#CURD DE CALIFICACIONES

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


@api.route('calificaciones/editar/<int:calificacion_id>',methods=['PUT'])
@jwt_required()
def editar_calificaciones(calificacion_id):
    existing_user_id= get_jwt_identity()
    profesor= db.session.get(Profesor,int(existing_user_id))

    if not profesor:
        return jsonify({"msg":"Usuario no autorizado"}),401
    
    calificacion=db.session.get(Calificacion,calificacion_id)

    if not calificacion:
        return ({"msg":"Calificacion no encontrada"})


    alumno= db.session.get(Alumno,calificacion.alumno_id)

    if not alumno:
        return jsonify({"msg":"Alumno no encontrado"})
    
    salones_profesor= [salon.id for salon in profesor.salones]
    salon_alumno = alumno.salon_id

    if salon_alumno not in salones_profesor:
       return jsonify({"msg": "Este estudiante no está es ninguna de tus aulas"}), 403
    

    data= request.get_json()

    if not data:
        return jsonify({"msg":"Datos Inválidos"}),400
    
    if "nota" in data:
        calificacion.nota= data["nota"]

    db.session.commit()

    return jsonify(calificacion.serialize()),200


@api.route('calificaciones/eliminar/<int:calificacion_id>',methods=['DELETE'])
@jwt_required()
def eliminar_calificaciones(calificacion_id):
    existing_user_id= get_jwt_identity()
    profesor= db.session.get(Profesor,int(existing_user_id))

    if not profesor:
        return jsonify({"msg":"Usuario no autorizado"}),401
    
    calificacion=db.session.get(Calificacion,calificacion_id)

    if not calificacion:
        return ({"msg":"Calificacion no encontrada"})


    alumno= db.session.get(Alumno,calificacion.alumno_id)

    if not alumno:
        return jsonify({"msg":"Alumno no encontrado"})
    
    salones_profesor= [salon.id for salon in profesor.salones]
    salon_alumno = alumno.salon_id

    if salon_alumno not in salones_profesor:
       return jsonify({"msg": "Este estudiante no está es ninguna de tus aulas"}), 403
    
    
    db.session.delete(calificacion)
    db.session.commit()

    return jsonify({"msg":"La calificacion ha sido borrada correctamente"}),200
    










#CRUD DE SALON
@api.route('/salon/crear', methods=['POST'])
@jwt_required()
def crear_salon():
    existing_user_id= get_jwt_identity()
    profesor= db.session.get(Profesor,int(existing_user_id))

    if not profesor:
        return jsonify({"msg":"Usuario no autorizado"}),401
    
    data= request.get_json()
    if not data:
        return({"msg":"Datos inválidos"}),400
    
    salon_id=data.get("salon_id")
    salon=db.session.get(Salon,salon_id)

    
    nombre_salon= data.get("nombre")
    salones_profesor= [salon.nombre for salon in profesor.salones]

    if nombre_salon is None:
        return jsonify({"msg":"El nombre del salon es requerido"}),400
    
    if nombre_salon in salones_profesor:
        return jsonify({"msg":"Ya existe un salon con este nombre"}),400



    classroom=Salon(
        nombre=nombre_salon,
        profesor_id=existing_user_id
    )

    db.session.add(classroom)
    db.session.commit()

    return jsonify({"msg":"El salon ha sido creado exitosamente"}),200


@api.route('/salon/editar/<int:salon_id>', methods=['PUT'])
@jwt_required()
def editar_salon(salon_id):
    existing_user_id= get_jwt_identity()
    profesor= db.session.get(Profesor,int(existing_user_id))

    if not profesor:
        return jsonify({"msg":"Usuario no autorizado"}),401

    data= request.get_json()
    
    if not data:
        return({"msg":"Datos inválidos"}),400
    
    salon=db.session.get(Salon,salon_id)

    nombre_salon= data.get("nombre")
    salones_profesor= [salon.nombre for salon in profesor.salones]

    if nombre_salon is None:
        return jsonify({"msg":"El nombre del salon es requerido"}),400
    
    if nombre_salon in salones_profesor:
        return jsonify({"msg":"Ya existe un salon con este nombre"}),400
    
    
    if "nombre" in data:
        salon.nombre=data["nombre"]
    
    db.session.commit()
    return jsonify(salon.serialize()),200



@api.route('salon/eliminar/<int:salon_id>',methods=['DELETE'])
@jwt_required()
def eliminar_salon(salon_id):
    existing_user_id= get_jwt_identity()
    profesor= db.session.get(Profesor,int(existing_user_id))

    if not profesor:
        return jsonify({"msg":"Usuario no autorizado"}),401
    
    salon=db.session.get(Salon,salon_id)

    if not salon:
        return ({"msg":"Calificacion no encontrada"}),400

    
    if salon.profesor_id != profesor.id:
        return jsonify({"msg":"Ya existe un salon con este nombre"}),400
    
    db.session.delete(salon)
    db.session.commit()

    return jsonify({"msg":"El salon ha sido borrado exitosamente"}),200








#CRUD DE MATERIAS

@api.route('/materias/crear',methods=['POST'])
@jwt_required()
def crear_materias():
     existing_user_id= get_jwt_identity()
     profesor= db.session.get(Profesor,int(existing_user_id))

     if not profesor:
        return jsonify({"msg":"Usuario no autorizado"}),401
    
     data= request.get_json()
     if not data:
        return({"msg":"Datos inválidos"}),400
    
     materia_id=data.get("materia_id")
     materia=db.session.get(Materia,materia_id)

     
     nombre_materia= data.get("nombre")

     if nombre_materia is None:
         return jsonify({"msg":"El nombre de la materia es requerido"})
     
     materia_existente=db.session.execute(select(Materia).where(Materia.nombre == "nombre")).first()

     if materia_existente:
         return jsonify({"msg":"Ya existe una materia con este nombre"}),400
     
     nueva_materia=Materia(
         nombre=nombre_materia
     )

     db.session.add(nueva_materia)
     db.session.commit()
     return jsonify({"msg":"La materia ha sido creado exitosamente"}),200


@api.route('/materias/editar/<int:materia_id>',methods=['PUT'])
@jwt_required()
def editar_materias(materia_id):
     existing_user_id= get_jwt_identity()
     profesor= db.session.get(Profesor,int(existing_user_id))

     if not profesor:
        return jsonify({"msg":"Usuario no autorizado"}),401
    
     data= request.get_json()
     if not data:
        return({"msg":"Datos inválidos"}),400
    
    
     materia=db.session.get(Materia,materia_id)

     
     nombre_materia= data.get("nombre")

     if nombre_materia is None:
         return jsonify({"msg":"El nombre de la materia es requerido"})
     

     materia_existente=db.session.execute(select(Materia).where(Materia.nombre == "nombre")).first()

     if materia_existente:
         return jsonify({"msg":"Ya existe una materia con este nombre"}),400


     if "nombre" in data:
        materia.nombre=data["nombre"]

     db.session.commit()

     return jsonify(materia.serialize()),200



@api.route('materias/eliminar/<int:materia_id>',methods=['DELETE'])
@jwt_required()
def eliminar_materia(materia_id):
    existing_user_id= get_jwt_identity()
    profesor= db.session.get(Profesor,int(existing_user_id))

    if not profesor:
        return jsonify({"msg":"Usuario no autorizado"}),401
    

    materia=db.session.get(Materia,materia_id)

    if not materia:
        return jsonify({"msg": "Materia inexistente"}),400
    
    db.session.delete(materia)
    db.session.commit()
    
    return jsonify({"msg":"La materia ha sido borrada exitosamente"}),200
    


    