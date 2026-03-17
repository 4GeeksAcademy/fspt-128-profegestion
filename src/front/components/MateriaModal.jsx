
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { crearMateria, verifyToken } from '../services/backendService';
import useGlobalReducer from "../hooks/useGlobalReducer";



export const MateriaModal = ({
  show,
  onClose,
  onCreate
}) => {

  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer()
  const [error, setError] = useState("")
  const [saving, setSaving] = useState("");
  const [materia, setMateria] = useState({
    nombre: "",
    salon_id: ""
  });


  useEffect(() => {
    if (show) {
      setMateria(
        {
          nombre: "",
          salon_id: "",
        }
      );
      setError("");
      setSaving(false);
    }
  }, [show]);

  if (!show) return null;

  const handleSave = async (e) => {
    e.preventDefault()

    setSaving(true);
    setError("");

    if (!materia.nombre.trim() || !materia.salon_id.trim()) {
      setError("Los campos son obligatorios");
      setSaving(false);
      return;
    }


    await onCreate(materia);
    setSaving(false)
    verifyToken(dispatch)
    onClose()
    return;
  };

  const handleClose = () => {
    console.log("cierra");
    onClose();

  };


  return (

    <>
      <div className="modal-backdrop fade show"></div>

      <div
        className={`modal ${show ? "show d-block" : ""}`}
        tabIndex="-1"
        onClick={handleClose}
      >
        <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Registro Materia</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSave}>
                <div className="mb-4">
                  <label className="form-label text-secondary">Nombre</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="asignatura"
                    name="nombre"
                    value={materia.nombre}
                    onChange={(e) => setMateria({ ...materia, [e.target.name]: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary">numero del salon</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="salon nº"
                    name="salon_id"
                    value={materia.salon_id}
                    onChange={(e) => setMateria({ ...materia, [e.target.name]: e.target.value })}
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-lg w-100 btn-secondary"
                    onClick={handleClose}
                  >
                    Close
                  </button>

                  <button
                    className="btn btn-lg w-100 text-white shadow-sm"
                    style={{ backgroundColor: "#6200e8" }}
                    type="submit"
                    disabled={saving}
                  >
                    {saving ? "registrando..." : "guardado"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>


  )

}





