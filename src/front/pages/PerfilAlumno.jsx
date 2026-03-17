import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../styles/dashboard.css";

export default function PerfilAlumno() {
  const { store } = useGlobalReducer();
  const alumno = store.user;

  if (!alumno || !alumno.nombre) {
    return <p className="text-center mt-5">Cargando perfil...</p>;
  }

  const inicial = alumno.nombre?.charAt(0).toUpperCase();

  const promedioGeneral = alumno.calificaciones?.length
    ? alumno.calificaciones.reduce((sum, c) => sum + c.nota, 0) /
      alumno.calificaciones.length
    : 0;

  const getBadge = (nota) => {
    if (nota >= 9) return "Excelente";
    if (nota >= 8) return "Buen nivel";
    if (nota >= 7) return "En progreso";
    return "Necesita apoyo";
  };

  return (
    <div className="dashboard-container">
      <div className="text-center mb-4"> 
        <br/><br/>
        <div
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            backgroundColor: "#6200E8",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            fontWeight: "bold",
            margin: "0 auto"
          }}
        >
          {inicial}
        </div>

        <p className="mt-2 fw-bold" style={{ fontSize: "1.4rem", color: "#6200E8" }}>
          {alumno.nombre}
        </p>
      </div>

      <h1 className="dashboard-title" style={{ color: "#6200E8" }}>
        Perfil del Alumno
      </h1>

      <p className="dashboard-subtitle">
        Vista general de tu información académica y tu progreso.
      </p>

      <div className="cards-grid">
        <div className="card">
          <h3 style={{ color: "#6200E8" }}>Promedio general</h3>
          <p className="card-number">{promedioGeneral.toFixed(2)}</p>
          <span>Promedio de tus materias activas.</span>
        </div>

        <div className="card">
          <h3 style={{ color: "#6200E8" }}>Materias activas</h3>
          <p className="card-number">{alumno.calificaciones?.length || 0}</p>
          <span>Total de materias evaluadas.</span>
        </div>
      </div>

      <div className="card mt-4 p-4">
        <h3 className="mb-3" style={{ color: "#6200E8" }}>Información personal</h3>

        <p><strong style={{ color: "#6200E8" }}>Nombre:</strong> {alumno.nombre}</p>
        <p><strong style={{ color: "#6200E8" }}>Email:</strong> {alumno.email}</p>
        <p><strong style={{ color: "#6200E8" }}>Salón asignado:</strong> {alumno.salon?.nombre}</p>
        
      </div>

      <div className="card mt-4 p-4">
        <h3 className="mb-3" style={{ color: "#6200E8" }}>Aula</h3>
        <p><strong style={{ color: "#6200E8" }}>Grupo actual:</strong> {alumno.salon?.nombre}</p>
        <p><strong style={{ color: "#6200E8" }}>Materias activas:</strong> {alumno.materias?.length || 0}</p>
      </div>

      <div className="card mt-4 p-4">
        <h3 className="mb-3" style={{ color: "#6200E8" }}>Profesor responsable</h3>
        <p><strong style={{ color: "#6200E8" }}>Nombre:</strong> {alumno.salon?.profesor?.nombre}</p>
        <p><strong style={{ color: "#6200E8" }}>Email:</strong> {alumno.salon?.profesor?.email}</p>
      </div>

      <div className="card mt-4 p-4">
        <h3 className="mb-3" style={{ color: "#6200E8" }}>Calificaciones por materia</h3>

        {alumno.calificaciones?.map((c, i) => (
          <div
            key={i}
            className="p-3 mb-3 rounded shadow-sm"
            style={{ backgroundColor: "#F8F5FF" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong style={{ color: "#6200E8" }}>{c.materia}</strong>
                <p className="text-muted m-0">{getBadge(c.nota)}</p>
              </div>

              <span
                className="fw-bold"
                style={{ color: "#6200E8", fontSize: "1.6rem" }}
              >
                {c.nota}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
