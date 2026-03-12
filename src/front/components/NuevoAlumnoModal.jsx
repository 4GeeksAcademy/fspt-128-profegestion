import useGlobalReducer from '../../hooks/useGlobalReducer';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"

import { registroAlumno } from '../services/backendService';



export const NuevoAlumnoModal = ({
  show,
  onClose,
}) => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const [user, setUser] = useState({
    nombre: "",
    email: "",
    password: "",
    salon_id: "",

  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user.email.trim() || !user.password.trim() || !user.nombre.trim() || !user.salon_id.trim()) {
      setError("nombre, email, salon y password son requeridos");
      return;
    }


    setLoading(true)
    const response = await registroAlumno(user)
    console.log("este es el response--->", response);


    if (response.error) {
      setError(response.error)
      setLoading(false)
      return
    }

    setLoading(false)
    navigate("/login-profesor")

    return response
  }



  useEffect(() => {
    console.log("estos son los datos del alumno---> ", user);

  }, [user])


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

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label text-secondary">Nombre</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="jhon doe"
                  name="nombre"
                  value={user.nombre}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required

                />
                <label className="form-label text-secondary">asigna el salon</label>
                <input
                  type="text"
                  placeholder="delta"
                  name="salon_id"
                  value={user.salon_id}
                  onChange={handleChange}
                  required
                />

              </div>
            </form>




          </div>
          <div class="modal-footer">
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