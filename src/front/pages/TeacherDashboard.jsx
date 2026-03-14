import React, { useEffect, useState } from "react";
import StudentTable from "../components/StudentTable";
import "../styles/dashboard.css";

export default function TeacherDashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch("https://urban-telegram-wrjpp4rx7qp42gg7g-3001.app.github.dev/api/students")
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(err => console.error("Error cargando estudiantes:", err));
  }, []);

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
          <p className="card-number">6</p>
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
