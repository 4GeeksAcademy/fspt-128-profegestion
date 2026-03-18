import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import { NuevoAlumnoModal } from "../components/NuevoAlumnoModal";
import { useNavigate } from "react-router-dom";
import  StudentAula from "../components/StudentAula"
import useGlobalReducer from "../hooks/useGlobalReducer";
import { verifyToken } from "../services/backendService";


export const Alumnos = () => {
    const { store, dispatch } = useGlobalReducer()
    const [showModal, setShowModal] = useState(false)
    const [students, setStudents] = useState([]);

 const navigate = useNavigate()


    const closeModal = () => {
        setShowModal(false)
              verifyToken(dispatch, navigate)

    }


    useEffect(() => {
        if (!store.user?.salones) return;

        const alumnos = store.user.salones.reduce((acc, salon) => {
            const totalMaterias = salon.materias.length;

            const alumnosConPromedio = salon.alumnos.map((alumno) => {
                const sumaNotas = alumno.calificaciones.reduce(
                    (sum, calificacion) => sum + calificacion.nota,
                    0
                );

                const promedio = totalMaterias > 0
                    ? sumaNotas / totalMaterias
                    : 0;

                return {
                    ...alumno,
                    promedio,
                    totalMaterias,
                    materiasCalificadas: alumno.calificaciones.length,
                    salonNombre: salon.nombre,
                };
            });

            return [...acc, ...alumnosConPromedio];
        }, []);

        const materias = store.user.salones.reduce((acc, salon) => {
            return [...acc, ...salon.materias];
        }, []);

        const totalNotasEsperadas = store.user.salones.reduce((acc, salon) => {
            return acc + (salon.alumnos.length * salon.materias.length);
        }, 0);

        const totalNotasRegistradas = store.user.salones.reduce((acc, salon) => {
            const notasSalon = salon.alumnos.reduce((sum, alumno) => {
                return sum + alumno.calificaciones.length;
            }, 0);

            return acc + notasSalon;
        }, 0);

        const porcentaje = totalNotasEsperadas > 0
            ? (totalNotasRegistradas / totalNotasEsperadas) * 100
            : 0;

        setStudents(alumnos);
        // setSubjects(materias);
        // setGradesPercentage(Number(porcentaje.toFixed(2)));
    }, [store.user]);


    const onAddClick = () => {
        setShowModal(true)

    }


    return (
        <div className="dashboard-container">
            <NuevoAlumnoModal show={showModal} onClose={closeModal} />
            <h1 className="dashboard-title">Alumnos</h1>
            <p className="dashboard-subtitle">Consulta y gestiona tus estudiantes.</p>

            <button onClick={onAddClick} className="btn-primary" style={{ marginBottom: "20px" }}>
                Añadir alumno
            </button>



            <StudentAula students={students} />
        </div>
    );
};
