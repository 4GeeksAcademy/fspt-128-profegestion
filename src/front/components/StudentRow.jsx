import React, { useState } from "react";

export default function StudentRow({ student }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setLoading(true);

    // Simulación de llamada a API externa
    await new Promise(resolve => setTimeout(resolve, 1200));

    console.log("Calificaciones enviadas a la API externa para:", student.name);

    setLoading(false);
    setSent(true);

    // Aquí en el futuro:
    // fetch("https://api-externa.com/enviar", { method: "POST", body: JSON.stringify(student) })
  };

  return (
    <tr>
      <td>{student.name}</td>
      <td>{student.subject}</td>
      <td>{student.grade}</td>
      <td>
        {!sent ? (
          <button 
            className="btn-primary"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        ) : (
          <span style={{ color: "green", fontWeight: "bold" }}>
            ✔ Enviado
          </span>
        )}
      </td>
    </tr>
  );
}

