import React from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";


const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3 fixed-top animate-fade-down">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center fw-bold" href="#">
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
            <li className="nav-item"><a className="nav-link" href="#features">Características</a></li>
            <li className="nav-item"><a className="nav-link" href="#benefits">Beneficios</a></li>
            <li className="nav-item"><a className="nav-link" href="#cta">Comenzar</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export const Layout = () => {
  return (
    <>
      <Navbar />

      <div style={{ paddingTop: "90px" }}>
        <Outlet />
      </div>

      <Footer />
    </>
  );
};
