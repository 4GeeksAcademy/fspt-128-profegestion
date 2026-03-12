import useGlobalReducer from '../../hooks/useGlobalReducer';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { registroProfesor } from '../../services/backendService';



export const RegistroProfesor = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
	const [error, setError] = useState("")
  const [user,setUser] = useState({
    nombre:"",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setError("");
		if (!user.email.trim() || !user.password.trim() || !user.nombre.trim()) {
			setError("nombre, email y password son requeridos");
			return;
		}
    		if (user.password.length <8 ) {
			setError("la contraseña tiene que tener almenos 8 caracteres");
			return;
		}
		if (user.password !== user.confirmPassword) {
			setError("las contraseñas no coinciden, intentalo de nuevo");
			return;
		}

		setLoading(true)
		const response = await registroProfesor(user)
		console.log("este es el response--->",response);
		
		
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
    console.log("estos son los datos de profesor---> ", user);

  }, [user])


  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">


        <div
          className="  col-lg-5 d-none d-lg-flex align-items-center justify-content-center text-white  "
        // style={{ backgroundImage: "url('/Fondo.png')" }}
        >
          <div className="d-flex text-center p-5 fondo-container ">
            <h1 className="display-4 fw-bold align-content-center justify-content-center">PANEL PARA DOCENTES</h1>
            <p className="lead"></p>
          </div>
        </div>


        <div className="col-lg-7 d-flex align-items-center bg-white">
          <div className="container p-5">
            <div className="row justify-content-center">
              <div className="col-md-9 col-xl-7">
                <div className=" d-flex justify-content-around mb-3">
                  <Link to="/registro-profesor">Registro</Link>
                  <Link to="/login-profesor">Login</Link>     
                </div>

                { error && (
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
                    <label className="form-label text-secondary">Confirma la contraseña</label>
                    <input
                      type="Password"
                      className="form-control form-control-lg"
                      minLength="8"
                      placeholder="********"
                      name="confirmPassword"
                      value={user.confirmPassword}
                      onChange={handleChange}
                      required
                    />

                  </div>


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
                        "registrate"
                      )}
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-muted small">
                      ¿Ya tienes cuenta? <Link to="/login-profesor" className="text-decoration-none" style={{ color: '#6200e8' }}>Inicia sesión</Link>
                    </p>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>


  )

}