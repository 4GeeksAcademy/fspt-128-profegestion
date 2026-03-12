import useGlobalReducer from '../../hooks/useGlobalReducer';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"

import { registroAlumno } from '../services/backendService';



export const NuevoAlumnoModal = ({
  show,
  onClose,
}) => {

  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer
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
      setUser();
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
    navigate("/")  //vista de calificaciones del alumno
    onClose()
  };

  const handleClose = () => {
    console.log("cierra");
    dispatch({ type: "auth_logout" })
    onClose();

  };


  return (


    <div class="modal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">registro Alumno</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">

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
                  value={setUser.nombre}
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
                  value={setUser.email}
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
                  value={setUser.password}
                  required

                />
                <label className="form-label text-secondary">asigna el salon</label>
                <input
                  type="text"
                  placeholder="delta"
                  name="salon_id"
                  value={setUser.salon_id}
                  required
                />

              </div>
            </form>




          </div>
          <div class="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handleClose}
            >Close
            </button>
            <button

              className="btn btn-lg w-100 text-white shadow-sm"
              style={{ backgroundColor: '#6200e8' }}
              type="submit"
              disabled={loading}
            >

              {loading ? (
                <span className="d-inline-flex align-items-center gap-2"
                  role="status">
                  <span className="spinner-border text-light"
                    role="status"
                    aria-hidden="true"
                  ></span>registrando...

                </span>
              ) : (
                "registro"
              )}
            </button>


          </div>
        </div>
      </div>
    </div>


  )

}





