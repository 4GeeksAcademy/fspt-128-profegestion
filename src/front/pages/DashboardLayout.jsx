import "../styles/layout.css";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Sidebar } from "../components/Sidebar";

import useGlobalReducer from "../hooks/useGlobalReducer";
import { verifyToken } from "../services/backendService";

export const DashboardLayout = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem("token") && localStorage.getItem("role") == "teacher") {
            console.log("verificando");

            verifyToken(dispatch, navigate);
        } else {
            dispatch({ type: "auth_logout" })
            navigate("/")
        }
    }, []);

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