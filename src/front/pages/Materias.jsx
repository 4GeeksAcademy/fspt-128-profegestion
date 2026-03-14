import React from "react";
import "../styles/dashboard.css";


export const Materias = () => {
  const materias = [
    { id: 1, nombre: "Matemáticas", grupos: 3 },
    { id: 2, nombre: "Lengua", grupos: 4 },
    { id: 3, nombre: "Ciencias", grupos: 2 },
  ];
  const [showModal, setShowModal] = useState(false);


  return (
    <div className="dashboard-container">
      <NuevoAlumnoModal show={showModal} onClose={() => setShowModal(false)} />
      <h1 className="dashboard-title">Materias</h1>
      <p className="dashboard-subtitle">Gestiona las asignaturas de tus aulas.</p>

      <button  className="btn-primary" style={{ marginBottom: "20px" }}>
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
