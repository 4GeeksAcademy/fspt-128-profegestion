

export const RegistroProfesor = () =>{
    return(      
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
                <h5 className=" link-primary">Registro</h5><h5 className="link-primary">loging</h5>
                </div>
                <form className="needs-validation">
                  
                  <div className="mb-3">
                    <label className="form-label text-secondary">Correo electrónico</label>
                    <input type="email" className="form-control form-control-lg" placeholder="ejemplo@correo.com" />
                  </div>

                 
                  <div className="mb-4">
                    <label className="form-label text-secondary">Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control form-control-lg" 
                      minLength="8"
                      placeholder="Mínimo 8 caracteres"
                      required
                    />
                    <label className="form-label text-secondary">Confirma la contraseña</label>
                    <input 
                      type="Confirm-password" 
                      className="form-control form-control-lg" 
                      minLength="8"
                      placeholder="Mínimo 8 caracteres"
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