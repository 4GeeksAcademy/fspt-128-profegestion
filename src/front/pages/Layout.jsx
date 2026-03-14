import "../styles/layout.css";
import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useEffect } from "react"
import { verifyToken } from "../services/backendService"
import { Sidebar } from "../components/Sidebar";

export const Layout = () => {
  const { store, dispatch } = useGlobalReducer()
  // useEffect(() => {
  //   verifyToken(store.token, dispatch)
  // }, [store.token])

  return (
    <div className="layout-container">
      <Sidebar />

      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
};


//     return (
//         <ScrollToTop>
//             <Navbar />
//                 <Outlet />
//             <Footer />
//         </ScrollToTop>
//     )
// }
