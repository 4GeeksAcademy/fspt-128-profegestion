
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"

import { registroAlumno } from '../services/backendService';
import useGlobalReducer from "../hooks/useGlobalReducer";



export const NuevoAlumnoModal = ({
  show,
  onClose,
}) => {

  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer()
  const [error, setError] = useState("")
  const [saving, setSaving] = useState("");
  const [user, setUser] = useState({
    nombre: "",
    email: "",
    password: "",
    salon_id: "",

  });


  useEffect(() => {
    if (show) {
      setUser(
        {
          nombre: "",
          email: "",
          password: "",
          salon_id: "",

        }
      );
      setError("");
      setSaving(false);
    }
  }, [show]);

  if (!show) return null;

  const handleSave = async () => {
    setError("");



    setSaving(true);
    const response = await registroAlumno(user)
    if (response.error) {
      setError(response.error)
      setSaving(false)
      return
    }
    dispatch({ type: "auth_set_user", payload: response });
    navigate("/") 
    onClose()
  };

  const handleClose = () => {
    console.log("cierra");
    dispatch({ type: "auth_logout" })
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
            <h5 className="modal-title">Registro Alumno</h5>
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
                  placeholder="jhon doe"
                  name="nombre"
                  value={user.nombre}
                  onChange={(e) => setUser({ ...user, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control form-control-lg"
                  placeholder="ejemplo@correo.com"
                  name="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary">Contraseña</label>
                <input
                  type="password"
                  className="form-control form-control-lg"
                  minLength="8"
                  placeholder="********"
                  name="password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-secondary">Asigna el salón</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="delta"
                  name="salon_id"
                  value={user.salon_id}
                  onChange={(e) => setUser({ ...user, salon_id: e.target.value })}
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





