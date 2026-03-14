// Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ isOpen }) => {

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className={`sidebar ${isOpen ? "" : "collapsed"}`}>

      {/* Logo */}
      <h2 className="sidebar-logo">CodeTrack</h2>

      <nav className="sidebar-menu">

        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={location.pathname === "/dashboard" ? "active" : ""}
        >
          Dashboard
        </Link>

        {/* DSA Tracker */}
        <Link
          to="/dsa"
          className={location.pathname === "/dsa" ? "active" : ""}
        >
          DSA Tracker
        </Link>

        {/* Applications */}
        <Link
          to="/applications"
          className={location.pathname === "/applications" ? "active" : ""}
        >
          Applications
        </Link>

        {/* Resume */}
        <Link
          to="/resume"
          className={location.pathname === "/resume" ? "active" : ""}
        >
          Resume
        </Link>

      </nav>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

    </aside>
  );
};

export default Sidebar;