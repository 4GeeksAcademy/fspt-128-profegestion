import useGlobalReducer from '../../hooks/useGlobalReducer';
import React, { useEffect, useState } from "react";
import { registroProfesor } from '../../services/backendService';



export const RegistroProfesor = () => {

  const { store, dispatch } = useGlobalReducer()
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

    const response = await registroProfesor(user)
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
            <h1 className="display-4 fw-bold align-content-center justify-content-center">panel para docenetes</h1>
            <p className="lead"></p>
          </div>
        </div>


        <div className="col-lg-7 d-flex align-items-center bg-white">
          <div className="container p-5">
            <div className="row justify-content-center">
              <div className="col-md-9 col-xl-7">
                <div className=" d-flex justify-content-around mb-3">
                  <h5 className=" link-">Registro</h5><h5 className="link-secondary">loging</h5>
                </div>

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
                    type="submit"
                    className="btn btn-lg w-100 text-white shadow-sm"
                    style={{ backgroundColor: '#6200e8' }}
                   
                  >
                    Crear cuenta
                  </button>

                  <div className="mt-4 text-center">
                    <p className="text-muted small">
                      ¿Ya tienes cuenta? <a href="#" className="text-decoration-none" style={{ color: '#6200e8' }}>Inicia sesión</a>
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