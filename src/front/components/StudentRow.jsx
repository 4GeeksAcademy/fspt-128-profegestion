import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentRow({ student }) {

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSend = async () => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1200));

    console.log("Calificaciones enviadas a la API externa para:", student.name);

    setLoading(false);
    setSent(true);

    navigate("/dashboard/alumnos");
  };

  return (
    <tr>
      <td>{student.nombre}</td>
      <td>{student.salon}</td>
      <td>{student.promedio.toFixed(2)}</td>
      <td>
        {!sent ? (
          <button
            className="btn-primary"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Editar"}
          </button>
        ) : (
          <span style={{ color: "green", fontWeight: "bold" }}>
            
          </span>
        )}
      </td>
    </tr>
  );
}