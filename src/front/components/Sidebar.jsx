import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

export const Sidebar = () => {
  return (
    <div className="sidebar">

      <div className="sidebar-header">
        <h2>Panel del profesor</h2>
      </div>

      <div className="sidebar-section">
        <ul>
          <li><NavLink to="/dashboard">Inicio</NavLink></li>
          <li><NavLink to="/dashboard/aulas">Aulas</NavLink></li>
          <li><NavLink to="/dashboard/alumnos">Alumnos</NavLink></li>
          <li><NavLink to="/dashboard/calificaciones">Calificaciones</NavLink></li>
          <li><NavLink to="/dashboard/materias">Materias</NavLink></li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <p>Todo más claro y ordenado</p>
        <span>Consulta tus grupos, registra notas y da seguimiento a tus alumnos desde una vista simple.</span>
      </div>

    </div>
  );
};
