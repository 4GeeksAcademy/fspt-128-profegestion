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
          <li><NavLink to="/">Inicio</NavLink></li>
          <li><NavLink to="/aulas">Aulas</NavLink></li>
          <li><NavLink to="/alumnos">Alumnos</NavLink></li>
          <li><NavLink to="/calificaciones">Calificaciones</NavLink></li>
          <li><NavLink to="/materias">Materias</NavLink></li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <p>Todo más claro y ordenado</p>
        <span>Consulta tus grupos, registra notas y da seguimiento a tus alumnos desde una vista simple.</span>
      </div>

    </div>
  );
};
