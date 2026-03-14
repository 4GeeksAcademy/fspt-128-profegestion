import React, { useState } from "react";

export const ModalCrearAula = ({ onClose, onCreate }) => {
  const [nombre, setNombre] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(nombre);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Crear nueva aula</h2>

        <form onSubmit={handleSubmit}>
          <label>Nombre del aula</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: 1ºA"
            className="form-control"
          />

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-primary"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
