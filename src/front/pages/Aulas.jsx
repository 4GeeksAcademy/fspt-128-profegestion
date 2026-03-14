import React from "react";
import "../styles/dashboard.css";

export const Aulas = () => {
  const aulas = [
    { id: 1, nombre: "1ºA", alumnos: 28, materias: 6 },
    { id: 2, nombre: "1ºB", alumnos: 25, materias: 6 },
    { id: 3, nombre: "2ºA", alumnos: 30, materias: 7 },
  ];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Aulas</h1>
      <p className="dashboard-subtitle">Gestiona tus grupos y sus asignaturas.</p>

      <button className="btn-primary" style={{ marginBottom: "20px" }}>
        Crear nueva aula
      </button>

      <div className="cards-grid">
        {aulas.map(aula => (
          <div key={aula.id} className="card">
            <h3>{aula.nombre}</h3>
            <p className="card-number">{aula.alumnos} alumnos</p>
            <span>{aula.materias} materias asignadas</span>
          </div>
        ))}
      </div>
    </div>
  );
};
