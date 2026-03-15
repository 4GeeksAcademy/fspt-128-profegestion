import "../styles/layout.css";
import React from "react";
import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"

import { Footer } from "../components/Footer"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useEffect } from "react"
import { verifyToken } from "../services/backendService"
import { Sidebar } from "../components/Sidebar";
import Navbar from "../components/Navbar";

export const Layout = () => {


  const { store, dispatch } = useGlobalReducer()
  // useEffect(() => {
  //   verifyToken(store.token, dispatch)
  // }, [store.token])

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

