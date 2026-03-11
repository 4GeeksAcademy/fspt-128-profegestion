import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import "../styles/layout.css";

export const Layout = () => {
  return (
    <div className="layout-container">
      <Sidebar />

      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
};
