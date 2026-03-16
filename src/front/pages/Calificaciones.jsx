import React from "react";
import "../styles/dashboard.css";
import { CalificacionesModal } from "../components/CalificacionesModal";
import { useState } from "react";

export const Calificaciones = () => {
  const [showModal, setShowModal] = useState(false)
  
  const closeModal = () => {
    setShowModal(false)
  }

   const onAddClick = () => {
    setShowModal(true)
  }
  const notas = [
    { id: 1, alumno: "Ana Torres", materia: "Matemáticas", nota: 9.2 },
    { id: 2, alumno: "Luis Pérez", materia: "Lengua", nota: 8.5 },
    { id: 3, alumno: "María López", materia: "Ciencias", nota: 7.8 },
  ];

  

  return (
    <div className="dashboard-container">
    <CalificacionesModal show={showModal} onClose={closeModal} />
      
      <h1 className="dashboard-title">Calificaciones</h1>
      <p className="dashboard-subtitle">Consulta y registra las notas de tus alumnos.</p>

      <button onClick={onAddClick} className="btn-primary" style={{ marginBottom: "20px" }}>
        Cargar nuevas calificaciones
      </button>

      <table className="students-table">
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Materia</th>
            <th>Nota</th>
          </tr>
        </thead>

        <tbody>
          {notas.map(n => (
            <tr key={n.id}>
              <td>{n.alumno}</td>
              <td>{n.materia}</td>
              <td>{n.nota}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
