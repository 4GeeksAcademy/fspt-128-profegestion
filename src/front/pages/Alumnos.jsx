import React from "react";
import "../styles/dashboard.css";

export const Alumnos = () => {
  const alumnos = [
    { id: 1, nombre: "Ana Torres", aula: "1ºA" },
    { id: 2, nombre: "Luis Pérez", aula: "1ºB" },
    { id: 3, nombre: "María López", aula: "2ºA" },
  ];

  const onAddClick = () => {
    
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Alumnos</h1>
      <p className="dashboard-subtitle">Consulta y gestiona tus estudiantes.</p>

      <button onClick={} className="btn-primary" style={{ marginBottom: "20px" }}>
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
