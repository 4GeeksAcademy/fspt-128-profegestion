import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { ModalCrearAula } from "../components/ModalCrearAula";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Aulas = () => {
  const { store, dispatch } = useGlobalReducer()
  const [showModal, setShowModal] = useState(false);
  const [aulas, setAulas] = useState([
    { id: 1, nombre: "1ºA", alumnos: 28, materias: 6 },
    { id: 2, nombre: "1ºB", alumnos: 25, materias: 6 },
    { id: 3, nombre: "2ºA", alumnos: 30, materias: 7 },
  ]);

  useEffect(() => {
    if (store.user?.salones) {
      const newAulas = store.user.salones.map(salon => {
        return {
          id: salon.id,
          nombre: salon.nombre,
          alumnos: salon.alumnos.length,
          materias: salon.materias.length
        }
      })

      setAulas(newAulas)
    }
  }, [store.user])

  const crearAula = async (nombre) => {

    try {
      const token = localStorage.getItem("token");

      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/salon/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ nombre }),
      });

      const data = await resp.json();

      if (resp.ok) {
        setAulas([
          ...aulas,
          { id: Date.now(), nombre, alumnos: 0, materias: 0 },
        ]);
        setShowModal(false);
      } else {
        alert(data.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Aulas</h1>
      <p className="dashboard-subtitle">
        Gestiona tus grupos y sus asignaturas.
      </p>

      <button
        className="btn-primary"
        style={{ marginBottom: "20px" }}
        onClick={() => setShowModal(true)}
      >
        Crear nueva aula
      </button>

      {/* MODAL CORRECTO */}
      <ModalCrearAula
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreate={crearAula}
      />

      <div className="cards-grid">
        {aulas.map((aula) => (
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
