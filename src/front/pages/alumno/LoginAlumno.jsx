import useGlobalReducer from '../../hooks/useGlobalReducer';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { editpassAlumno } from '../../services/backendService';


export const LoginAlumno = () => {

  const navigate = useNavigate()
  const [passwordModal, setpasswordModal] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const [user,setUser] = useState({

    email: "",
    password: ""

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
    if (!user.email.trim() || !user.password.trim()) {
      setError("email y password son requeridos");
      return;
    }

    setLoading(true);
    const response = await editpassAlumno(user)
    if (response.error) {
      setError(response.error)
      setLoading(false)
      return
    }
// en esta linea de abajo dudo del porque
    const  = response.user?password;  
     
    dispatch({ type: "auth_login", payload: {token: response.token}});
    if(!newPassword) {
      setpasswordModal(true)
      setLoading(false)
      return
    }
    dispatch({ type: "auth_set_user", payload: response.token});

    setLoading(false)
    navigate("/") 

    return response
  }

  useEffect(() => {
    console.log("estos son los datos del alumno---> ", user);

  }, [user])


  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row g-0 h-100">


        <div
          className="  col-lg-5 d-none d-lg-flex align-items-center justify-content-center text-white  "
 
        >
          <div className="d-flex text-center p-5 fondo-container ">
            <h1 className="display-4 fw-bold align-content-center justify-content-center">panel para docenetes</h1>
            <p className="lead"></p>
          </div>
        </div>


        <div className="col-lg-7 d-flex align-items-center bg-white">
          <div className="container p-5">
            <div className="row justify-content-center">
              <div className="col-md-9 col-xl-7">


                { error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}
              
                <form onSubmit={handleSubmit}>



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
                          ></span>preparando tus cosas...
              
                        </span>
                      ) : (
                        "entrar"
                      )}
                  </button>

                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>


  )

}