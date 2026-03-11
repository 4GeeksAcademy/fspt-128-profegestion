import React from "react";
import "../styles/dashboard.css";

export const Home = () => {
  return (
    <div className="dashboard-container">

      <h1 className="dashboard-title">Gestiona tus aulas, alumnos, calificaciones y materias.</h1>
      <p className="dashboard-subtitle">Todo más claro y ordenado.</p>

      <div className="cards-grid">

        <div className="card">
          <h3>Alumnos</h3>
          <p className="card-number">214</p>
          <span>5 nuevos alumnos pendientes de acceso.</span>
        </div>

        <div className="card">
          <h3>Aulas</h3>
          <p className="card-number">8</p>
          <span>2 grupos requieren actualización.</span>
        </div>

        <div className="card">
          <h3>Calificaciones</h3>
          <p className="card-number">92%</p>
          <span>La mayoría de notas del periodo ya está cargada.</span>
        </div>

        <div className="card">
          <h3>Materias</h3>
          <p className="card-number">6</p>
          <span>1 materia necesita revisión de evaluación.</span>
        </div>

        <div className="card">
          <h3>Alumnos activos</h3>
          <p className="card-number">209</p>
          <span>La mayoría ya ingresó a su cuenta.</span>
        </div>

      </div>

    </div>
  );
};
