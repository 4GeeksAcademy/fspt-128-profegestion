import React, { useEffect, useState } from "react";

export const ModalCrearAula = ({ show, onClose, onCreate }) => {
  const [nombre, setNombre] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      setNombre("");
      setSaving(false);
      setError("");
    }
  }, [show]);

  if (!show) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!nombre.trim()) {
      setError("El nombre del aula es obligatorio");
      setSaving(false);
      return;
    }

    await onCreate(nombre);
    setSaving(false);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal */}
      <div
        className={`modal fade ${show ? "show d-block" : ""}`}
        tabIndex="-1"
        onClick={handleClose}
      >
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title">Crear nueva aula</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2">{error}</div>
              )}

              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="form-label text-secondary">Nombre del aula</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Ej: 1ºA"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-lg w-100 btn-secondary"
                    onClick={handleClose}
                  >
                    Cancelar
                  </button>

                  <button
                    className="btn btn-lg w-100 text-white shadow-sm"
                    style={{ backgroundColor: "#6200e8" }}
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "Guardando..." : "Crear aula"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
