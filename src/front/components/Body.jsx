import { Link } from "react-router-dom";

const Body = () => {
  return (
    <header
      className="hero d-flex align-items-center"
      style={{
        backgroundImage: "url('/Fondo.png')",
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh"
      }}
    >
      <div className="container text-center text-white animate-fade-up">
        <h1 className="display-4 fw-bold">Gestión docente moderna y simple</h1>
        <p className="lead mt-3">
          Organiza clases, alumnos, calificaciones y recursos desde un solo lugar.
        </p>
        <div className="mt-4">
          <Link to="/registro-profesor">
            <button className="btn btn-light btn-lg me-2 btn-animate">Accede al portal del profesor</button>
          </Link>
          <Link to={"/login-alumno"}>
            <a className="btn btn-outline-light btn-lg btn-animate">
              Accede al portal del alumno
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Body;
