import { useEffect, useState } from "react";

const Navbar = () => {
  const [profesor, setProfesor] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("profesor");
    if (data) {
      setProfesor(JSON.parse(data));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profesor");
    setProfesor(null);
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-0 fixed-top animate-fade-down">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center fw-bold" href="/">
          <img src="/Logo.png" alt="logo" width="70" className="me-2" />
          Portal Educativo VIP
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto">

            {!profesor && (
              <li className="nav-item">
                <a className="nav-link" href="/registro-profesor">Comenzar</a>
              </li>
            )}

            {profesor && (
              <>
                <li className="nav-item d-flex align-items-center me-3 fw-semibold">
                  Bienvenido/a, {profesor.nombre}
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={cerrarSesion}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
