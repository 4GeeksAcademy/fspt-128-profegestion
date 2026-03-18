import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const usuario = store.user;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
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
    navigate("/", { replace: true });
  };

  const irAPortal = (e) => {
    e.preventDefault();

    // 🟣 Si está logeado → logout + home
    if (usuario) {
      localStorage.removeItem("token");
      localStorage.removeItem("profesor");
      localStorage.removeItem("alumno");

      dispatch({ type: "auth_logout" });
      navigate("/", { replace: true });
      return;
    }

    // 🟢 Si está en registro, login alumno o panel alumnos → ir a home
    if (
      location.pathname === "/registro-profesor" ||
      location.pathname === "/login-alumno" ||
      location.pathname === "/dashboard/alumnos"
    ) {
      navigate("/", { replace: true });
      return;
    }

    // 🔴 En cualquier otro caso → no hace nada
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-0 fixed-top">
      <div className="container">
        <a
          className="navbar-brand d-flex align-items-center fw-bold"
          href="/"
          onClick={irAPortal}
          style={{
            cursor:
              usuario ||
              location.pathname === "/registro-profesor" ||
              location.pathname === "/login-alumno" ||
              location.pathname === "/dashboard/alumnos"
                ? "pointer"
                : "default",
          }}
        >
          <img src="/Logo.png" alt="logo" width="70" className="me-2" />
          Portal Educativo VIP
        </a>

        <div className="ms-auto d-flex align-items-center gap-3">
          {!usuario ? (
            <a className="nav-link" href="/registro-profesor">
              Comenzar
            </a>
          ) : (
            <>
              <span className="fw-semibold">
                Bienvenido/a, {usuario.nombre}
              </span>

              <button
                className="btn btn-sm text-white"
                style={{ backgroundColor: "#6200E8" }}
                onClick={cerrarSesion}
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;