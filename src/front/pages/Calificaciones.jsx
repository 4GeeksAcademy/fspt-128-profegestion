import React, { useEffect } from "react";
import "../styles/dashboard.css";
import { useState } from "react";
import { useEffectEvent } from "react";
import { ModalCalificaciones } from "../components/ModalCalificaciones";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { verifyToken } from "../services/backendService";



export const Calificaciones = () => {
  const { store, dispatch } = useGlobalReducer()
  const [showModal, setShowModal] = useState(false)

  const closeModal = () => {
    setShowModal(false)
  }

  const onAddClick = () => {
    setShowModal(true)
  }
  const [notas, setNotas] = useState([]);

  const obtenerAlumnos = async () => {
    console.log("se ejecuta");

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/alumnos/calificaciones`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
    const data = await response.json()
    setNotas(data)
    verifyToken(dispatch)

  }


  useEffect(() => {
    obtenerAlumnos()
  }, [])


  return (
    <div className="dashboard-container">
      <ModalCalificaciones show={showModal} onClose={closeModal} setNotas={setNotas} recargarCalificaciones={obtenerAlumnos} />

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
          {notas.length > 0 ? (
            notas.map(n => (
              <tr key={n.id}>
                <td>{n.alumno}</td>
                <td>{n.materia ?? "Sin materia"}</td>
                <td>{n.nota ?? "Pendiente"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                No hay calificaciones registradas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


