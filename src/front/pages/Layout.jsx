import React from "react";
import { Footer } from "../components/Footer";
import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useEffect } from "react"
import { verifyToken } from "../services/backendService"

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-3 fixed-top animate-fade-down">
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
            <li className="nav-item"><a className="nav-link" href="#features">Características</a></li>
            <li className="nav-item"><a className="nav-link" href="#benefits">Beneficios</a></li>
            <li className="nav-item"><a className="nav-link" href="#cta">Comenzar</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}



export const Layout = () => {
  const { store, dispatch } = useGlobalReducer()
    useEffect(() => {
      verifyToken(store.token, dispatch)
    }, [store.token])
  return (
    <ScrollToTop>
      <>
        <Navbar />

          <div style={{ paddingTop: "90px" }}>
            <Outlet />
          </div>

        <Footer />
      </>
    </ScrollToTop>
  );
};




