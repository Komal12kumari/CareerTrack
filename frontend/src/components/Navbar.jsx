import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {

  const location = useLocation();   // detects current page

  return (
    <nav className="navbar">

      <h2 className="logo">Career Tracker</h2>

      <div className="nav-links">

        {/* Dashboard */}
        {location.pathname !== "/dashboard" && (
          <Link
            to="/dashboard"
            className={`nav-btn ${location.pathname === "/dashboard" ? "active" : ""}`}
          >
            Dashboard
          </Link>
        )}

        {/* DSA Tracker */}
        {location.pathname !== "/dsa" && (
          <Link
            to="/dsa"
            className={`nav-btn ${location.pathname === "/dsa" ? "active" : ""}`}
          >
            DSA Tracker
          </Link>
        )}

        {/* Applications */}
        {location.pathname !== "/applications" && (
          <Link
            to="/applications"
            className={`nav-btn ${location.pathname === "/applications" ? "active" : ""}`}
          >
            Applications
          </Link>
        )}

        {/* Resume */}
        {location.pathname !== "/resume" && (
          <Link
            to="/resume"
            className={`nav-btn ${location.pathname === "/resume" ? "active" : ""}`}
          >
            Resume
          </Link>
        )}

      </div>

    </nav>
  );
};

export default Navbar;