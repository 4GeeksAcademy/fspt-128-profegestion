import React from "react";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <>
      {/* Aquí puedes poner Navbar si quieres que aparezca en todas las páginas */}
      
      <Outlet />

      {/* Aquí puedes poner Footer si quieres */}
    </>
  );
};
