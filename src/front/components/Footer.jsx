export const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#6200E8", color: "white", fontFamily: "Fira Sans" }}>
      <div className="container py-5">
        <div className="row gy-4">

         
          <div className="col-12 col-md-6 col-lg-4">
            <h3 className="fw-bold">PortalEducativoVip</h3>
            <p className="mt-2">
              Gestiona con eficiencia tu tiempo, tus aulas y el rendimiento de tus alumnos en una plataforma sencilla y luminosa.
            </p>
          </div>

         
          <div className="col-6 col-md-3 col-lg-2">
            <h5 className="fw-bold">Producto</h5>
            <ul className="list-unstyled mt-3">
              <li><a href="#" className="footer-link">Características</a></li>
              <li><a href="#" className="footer-link">Precios</a></li>
              <li><a href="#" className="footer-link">Casos de uso</a></li>
              <li><a href="#" className="footer-link">Actualizaciones</a></li>
            </ul>
          </div>

         
          <div className="col-6 col-md-3 col-lg-2">
            <h5 className="fw-bold">Recursos</h5>
            <ul className="list-unstyled mt-3">
              <li><a href="#" className="footer-link">Centro de ayuda</a></li>
              <li><a href="#" className="footer-link">Blog para docentes</a></li>
              <li><a href="#" className="footer-link">Tutoriales en video</a></li>
              <li><a href="#" className="footer-link">Comunidad</a></li>
            </ul>
          </div>

      
          <div className="col-6 col-md-3 col-lg-2">
            <h5 className="fw-bold">Legal</h5>
            <ul className="list-unstyled mt-3">
              <li><a href="#" className="footer-link">Términos de servicio</a></li>
              <li><a href="#" className="footer-link">Política de privacidad</a></li>
              <li><a href="#" className="footer-link">Política de cookies</a></li>
              <li><a href="#" className="footer-link">Aviso legal</a></li>
            </ul>
          </div>

        </div>

        <hr className="border-light opacity-25 mt-4" />

        <div className="text-center py-3">
          © 2026 PortalEducativoVip. Todos los derechos reservados.
        </div>
      </div>

      <style>{`
        .footer-link {
          color: #ffffffcc;
          text-decoration: none;
          transition: 0.2s;
        }
        .footer-link:hover {
          color: #ffffff;
        }
      `}</style>
    </footer>
  );
};
