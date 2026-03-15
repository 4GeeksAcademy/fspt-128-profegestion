import React from "react";
import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import { MateriaModal } from "../components/MateriaModal";
import { crearMateria } from "../services/backendService";

export const Materias = () => {
  // const materias = [
  //   // { id: 1, nombre: "Matemáticas", grupos: 3 },
  //   // { id: 2, nombre: "Lengua", grupos: 4 },
  //   // { id: 3, nombre: "Ciencias", grupos: 2 },
  // ];
  const [showModal, setShowModal] = useState(false);
  const [materias, setMateria] = useState([]);
  

  useEffect(() => {
        crearMateria();
    }, []);


  return (
    <div className="dashboard-container">
      <MateriaModal show={showModal} onClose={() => setShowModal(false)} />
      <h1 className="dashboard-title">Materias</h1>
      <p className="dashboard-subtitle">Gestiona las asignaturas de tus aulas.</p>

      <button  className="btn-primary" style={{ marginBottom: "20px" }} onClick={() => setShowModal(true)}>
        Añadir materia
      </button>

      <div className="cards-grid">
        {materias.map((m) => (
          <div key={m.id} className="card">
            <h3>{m.nombre}</h3>
            <p className="card-number">{m.salones_asignados ? m.salones_asignados.length : 0} salones</p>

          </div>
        ))}
      </div>
    </div>
  );
};
