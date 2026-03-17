import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"

import useGlobalReducer from "../hooks/useGlobalReducer";
import { calificacionRegistro } from "../services/backendService";



export const CalificacionesModal = ({
  show,
  onClose,
}) => {

  const navigate = useNavigate()
  const { store, dispatch } = useGlobalReducer()
  const [error, setError] = useState("")
  const [saving, setSaving] = useState("");
  
  const [user, setUser] = useState({
    Salon:"",
    Alumno: "",
    Materia: "",
    Nota: "",
    

  });


  useEffect(() => {
    if (show) {
      setUser(
        {
          Alumno: "",
          Materia: "",
          Nota: "",
         

        }
      );
      setError("");
      setSaving(false);
    }
  }, [show]);


  const handleInputChange = (e)=>{
    setUser({
      ...user,[e.target.name]:e.target.value
    })
  }

  if (!show) return null;

  const handleSave = async (e) => {
    e.preventDefault()
    setError("");

    setSaving(true);
    const response = await calificacionRegistro(user)
    if (response.error) {
      setError(response.error)
      setSaving(false)
      return
    }
    dispatch({ type: "auth_set_user", payload: response });
    navigate("/Calificaciones") 
    //vista de calificaciones del alumno
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
              <h5 className="modal-title">Registro de calificaciones</h5>
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
                  <label className="form-label text-secondary">Salón</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="delta"
                    name="salon_id"
                    value={user.Salon}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary">Alumno</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Alumno"
                    name="alumno"
                    value={user.Alumno}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary">Materia</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="materia"
                    name="materia"
                    value={user.Materia}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-secondary">Nota</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="nota"
                    name="nota"
                    value={user.Nota}
                    onChange={handleInputChange}
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





