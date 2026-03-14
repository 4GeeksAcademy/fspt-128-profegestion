const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-0 fixed-top animate-fade-down">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center fw-bold" href="/">
          <img src="/Logo.png" alt="logo" width="70" className="me-2" />
          Portal Educativo VIP
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        
      </div>
    </nav>
  );
};

export default Navbar;
