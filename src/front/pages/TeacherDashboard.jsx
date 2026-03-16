import React, { useEffect, useState } from "react";
import StudentTable from "../components/StudentTable";
import "../styles/dashboard.css";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function TeacherDashboard() {
  const { store, dispatch } = useGlobalReducer()


  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([])
  const [gradesPercentage, setGradesPercentage] = useState(0);


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
    setSubjects(materias);
    setGradesPercentage(Number(porcentaje.toFixed(2)));
  }, [store.user]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Panel del Profesor</h1>
      <p className="dashboard-subtitle">Gestiona tus alumnos y sus calificaciones.</p>

      <div className="cards-grid">
        <div className="card">
          <h3>Alumnos</h3>
          <p className="card-number">{students.length}</p>
          <span>Estudiantes registrados en el sistema.</span>
        </div>

        <div className="card">
          <h3>Materias</h3>
          <p className="card-number">{subjects.length}</p>
          <span>Materias activas este periodo.</span>
        </div>

        <div className="card">
          <h3>Calificaciones cargadas</h3>
          <p className="card-number">{gradesPercentage}</p>
          <span>Notas registradas correctamente.</span>
        </div>
      </div>

      <StudentTable students={students} />
    </div>
  );
}
