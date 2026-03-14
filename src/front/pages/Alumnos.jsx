import React, { useState } from "react";
import "../styles/dashboard.css";
import { NuevoAlumnoModal } from "../components/NuevoAlumnoModal";

export const Alumnos = () => {

  const [showModal, setShowModal] = useState(false)
  const closeModal = () => {
    setShowModal(false)
  }

  const alumnos = [
    { id: 1, nombre: "Ana Torres", aula: "1ºA" },
    { id: 2, nombre: "Luis Pérez", aula: "1ºB" },
    { id: 3, nombre: "María López", aula: "2ºA" },
  ];


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

      <table className="students-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Aula</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {alumnos.map(alumno => (
            <tr key={alumno.id}>
              <td>{alumno.nombre}</td>
              <td>{alumno.aula}</td>
              <td>
                <button className="btn-secondary">Enviar credenciales</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
