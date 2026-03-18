import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const usuario = store.user;

  useEffect(() => {
    // Para mantener sesión al recargar
    const prof = localStorage.getItem("profesor");
    const alum = localStorage.getItem("alumno");

    if (!usuario) {
      if (prof) {
        dispatch({ type: "auth_set_user", payload: JSON.parse(prof) });
      } else if (alum) {
        dispatch({ type: "auth_set_user", payload: JSON.parse(alum) });
      }
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profesor");
    localStorage.removeItem("alumno");

    dispatch({ type: "auth_logout" }); 
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-0 fixed-top">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center fw-bold" href="/">
          <img src="/Logo.png" alt="logo" width="70" className="me-2" />
          Portal Educativo VIP
        </a>

        <div className="ms-auto">
          {!usuario ? (
            <a className="nav-link" href="/registro-profesor">
              Comenzar
            </a>
          ) : (
            <div className="d-flex align-items-center gap-3">
              <span className="fw-semibold">
                Bienvenido/a, {usuario.nombre}
              </span>

              <button
                className="btn btn btn-sm text-white"
                style={{ backgroundColor: "#6200E8" }}
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;