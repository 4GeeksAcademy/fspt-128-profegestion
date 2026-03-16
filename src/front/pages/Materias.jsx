import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Materias = () => {
  const { store, dispatch } = useGlobalReducer()
  const [materias, setMaterias] = useState([
    { id: 1, nombre: "Matemáticas", grupos: 3 },
    { id: 2, nombre: "Lengua", grupos: 4 },
    { id: 3, nombre: "Ciencias", grupos: 2 },
  ]);

  useEffect(() => {
    console.log(materias);
    if (!store.user?.salones) return;

    const materiasUnicas = store.user?.salones?.reduce((acc, salon) => {
      salon.materias.forEach(materia => {
        const existente = acc.find((m) => m.id === materia.materia_id)

        if (existente) {
          existente.grupos += 1
        } else {
          acc.push({
            id: materia.materia_id,
            nombre: materia.materia,
            grupos: 1
          })
        }
      });
      return acc
    }, [])
    setMaterias(materiasUnicas)

  }, [store.user])

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Materias</h1>
      <p className="dashboard-subtitle">Gestiona las asignaturas de tus aulas.</p>

      <button className="btn-primary" style={{ marginBottom: "20px" }}>
        Añadir materia
      </button>

      <div className="cards-grid">
        {materias.map(m => (
          <div key={m.id} className="card">
            <h3>{m.nombre}</h3>
            <p className="card-number">{m.grupos} grupos</p>
            <span>Asignada a varios cursos</span>
          </div>
        ))}
      </div>
    </div>
  );
};