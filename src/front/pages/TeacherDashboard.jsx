import React, { useEffect, useState } from "react";
import StudentTable from "../components/StudentTable";
import "../styles/dashboard.css";
import useGlobalReducer from "../hooks/useGlobalReducer";

export default function TeacherDashboard() {
  const { store, dispatch } = useGlobalReducer()


  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([])


  useEffect(() => {
    if (store.user) {
      const alumnos = store.user?.salones?.reduce((prev, current) => { return [...prev, ...current.alumnos] }, [])
      const materias = store.user?.salones?.reduce((prev, current) => { return [...prev, ...current.materias] }, [])


      if (alumnos.length) {
        setStudents(alumnos)
      }
      if (materias.length) {
        setSubjects(materias)
      }

    }


  }, [store.user])

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
          <p className="card-number">92%</p>
          <span>Notas registradas correctamente.</span>
        </div>
      </div>

      <StudentTable students={students} />
    </div>
  );
}
