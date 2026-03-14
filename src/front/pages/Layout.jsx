import "../styles/layout.css";
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Sidebar } from "../components/Sidebar";

import useGlobalReducer from "../hooks/useGlobalReducer";
import { verifyToken } from "../services/backendService";

export const Layout = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    verifyToken(store.token, dispatch);
  }, [store.token]);

  return (
    <div className="layout-container">
      <Sidebar />

      <div className="layout-content">
        <ScrollToTop>
          <>
            <Navbar />

            <div style={{ paddingTop: "90px" }}>
              <Outlet />
            </div>

            <Footer />
          </>
        </ScrollToTop>
      </div>
    </div>
  );
};
