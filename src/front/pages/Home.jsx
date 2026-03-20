import Navbar from "../components/Navbar.jsx";
import Body from "../components/Body.jsx";
import Caracteristicas from "../components/Caracteristicas.jsx";
import Beneficios from "../components/Beneficios.jsx";
import Comenzar from "../components/Comenzar.jsx";

export const Home = () => {
  return (
    <>
      <Body />
      <Caracteristicas />
      <Beneficios />
      <Comenzar />
    </>
  );
};