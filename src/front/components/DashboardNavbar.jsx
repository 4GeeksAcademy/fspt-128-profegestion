import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const DashboardNavbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" }); 
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-2 fixed-top">
      <div className="container-fluid px-4">

        <Link className="navbar-brand fw-bold" to="/dashboard">
          Panel del Profesor
        </Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">

            
            <li className="nav-item d-flex align-items-center me-3">
              <span className="fw-bold text-primary">
                {store.profesor?.nombre || "Profesor"}
              </span>
            </li>

           
            <li className="nav-item">
              <button
                className="btn btn-outline-danger"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
