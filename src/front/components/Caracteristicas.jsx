const Caracteristicas = () => {
  const items = [
    { title: "Gestión de Alumnos", text: "Administra perfiles, asistencia y rendimiento académico." },
    { title: "Calificaciones Inteligentes", text: "Registra evaluaciones y genera reportes automáticos." },
    { title: "Comunícate con los padres", text: "Informa las notas de los alumnos a través de nuestra mensajería." }
  ];

  return (
    <section id="features" className="py-5">
      <div className="container text-center">
        <h2 className="fw-bold mb-4 animate-fade-up">Todo lo que necesitas, sin complicaciones</h2>
        <p className="text-muted mb-5 animate-fade-up">
          Herramientas intuitivas diseñadas para docentes.
        </p>

        <div className="row g-4">
          {items.map((item, i) => (
            <div className="col-md-4 animate-zoom" key={i}>
              <div className="feature-box p-4 shadow-sm">
                <h5 className="fw-bold">{item.title}</h5>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Caracteristicas;
