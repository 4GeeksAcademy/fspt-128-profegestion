from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Integer, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_bcrypt import check_password_hash, generate_password_hash
from typing import List


db = SQLAlchemy()


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
        }


class Profesor(db.Model):
    # __tablename__ = "profesor"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    salones: Mapped[List["Salon"]] = relationship(
        back_populates="profesor",
        cascade="all, delete-orphan"
    )

    calificaciones_realizadas: Mapped[List["Calificacion"]] = relationship(
        back_populates="profesor",
        cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "salones": [salon.serialize() for salon in self.salones],
            "calificaciones_realizadas": [calificacion.serialize() for calificacion in self.calificaciones_realizadas]
        }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Alumno(db.Model):
    # __tablename__ = "alumno"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(
        String(255), nullable=True)
    salon_id: Mapped[int] = mapped_column(
        ForeignKey("salon.id"), nullable=True)

    salon: Mapped["Salon"] = relationship(
        back_populates="alumnos"
    )

    calificaciones: Mapped[List["Calificacion"]] = relationship(
        back_populates="alumno",
        cascade="all, delete-orphan"
    )

    must_change_password: Mapped[bool] = mapped_column(
        default=True, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "salon_id": self.salon_id,
            "salon": self.salon.nombre,
            "must_change_password": self.must_change_password,
            "calificaciones": [calificacion.serialize() for calificacion in self.calificaciones]
        }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Salon(db.Model):
    # __tablename__ = "salon"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(50), nullable=False)
    profesor_id: Mapped[int] = mapped_column(
        ForeignKey("profesor.id"), nullable=False)

    profesor: Mapped["Profesor"] = relationship(
        back_populates="salones"
    )

    alumnos: Mapped[List["Alumno"]] = relationship(
        back_populates="salon",
        cascade="all, delete-orphan"
    )

    materias_asignadas: Mapped[List["SalonMateria"]] = relationship(
        back_populates="salon",
        cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "profesor_id": self.profesor_id,
            "alumnos": [alumno.serialize() for alumno in self.alumnos],
            "materias": [materia.serialize() for materia in self.materias_asignadas]
        }


class Calificacion(db.Model):
    # __tablename__ = "calificacion"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    profesor_id: Mapped[int] = mapped_column(
        ForeignKey("profesor.id"), nullable=False)
    alumno_id: Mapped[int] = mapped_column(
        ForeignKey("alumno.id"), nullable=False)
    salon_materia_id: Mapped[int] = mapped_column(
        ForeignKey("salon_materia.id"), nullable=False)
    nota: Mapped[float] = mapped_column(Float, nullable=False)

    profesor: Mapped["Profesor"] = relationship(
        back_populates="calificaciones_realizadas"
    )

    alumno: Mapped["Alumno"] = relationship(
        back_populates="calificaciones"
    )

    salon_materia: Mapped["SalonMateria"] = relationship(
        back_populates="calificaciones"
    )

    def serialize(self):
        return {
            "id": self.id,
            "profesor_id": self.profesor_id,
            "alumno_id": self.alumno_id,
            "salon_materia_id": self.salon_materia_id,
            "nota": self.nota
        }


class Materia(db.Model):
    # __tablename__ = "materia"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)

    salones_asignados: Mapped[List["SalonMateria"]] = relationship(
        back_populates="materia",
        cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre
            }


class SalonMateria(db.Model):
    # __tablename__ = "salon_materia"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    salon_id: Mapped[int] = mapped_column(
        ForeignKey("salon.id"), nullable=False)
    materia_id: Mapped[int] = mapped_column(
        ForeignKey("materia.id"), nullable=False)

    salon: Mapped["Salon"] = relationship(
        back_populates="materias_asignadas"
    )

    materia: Mapped["Materia"] = relationship(
        back_populates="salones_asignados"
    )

    calificaciones: Mapped[List["Calificacion"]] = relationship(
        back_populates="salon_materia",
        cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "salon_id": self.salon_id,
            "materia_id": self.materia_id,
            "materia": self.materia.nombre
        }
