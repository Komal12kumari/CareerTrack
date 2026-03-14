import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import "../pages/Dashboard.css";
import "./ApplicationPage.css";

const ApplicationPage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [applications, setApplications] = useState([]);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showToggle, setShowToggle] = useState(true);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "DSA Tracker", path: "/dsa" },
    { name: "Applications", path: "/applications" },
    { name: "Resume", path: "/resume" },   
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchApplications = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/applications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplications(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  /* Hide toggle button on scroll */

  useEffect(() => {

    let lastScroll = 0;

    const handleScroll = () => {

      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll) {
        setShowToggle(false);
      } else {
        setShowToggle(true);
      }

      lastScroll = currentScroll;

    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/applications",
        { company, role, status, link, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompany("");
      setRole("");
      setStatus("Applied");
      setLink("");
      setNotes("");

      fetchApplications();

    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/applications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchApplications();

    } catch (err) {
      console.log(err);
    }
  };

  return (

    <div className={`dashboard ${sidebarOpen ? "" : "sidebar-collapsed"}`}>

      {/* SIDEBAR */}

      <aside className="sidebar">

        <h2 className="logo">CareerTrack</h2>

        <ul className="nav-links">

          {navItems.map((item) => (

            <li
              key={item.path}
              className={location.pathname === item.path ? "active" : ""}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </li>

          ))}

          <li className="logout" onClick={handleLogout}>
            Logout
          </li>

        </ul>

      </aside>


      {/* MAIN CONTENT */}

      <main className="main-content">

        {showToggle && (
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "✖" : "☰"}
          </button>
        )}

        <h1>Application Tracker</h1>


        {/* FORM */}

        <form className="application-form" onSubmit={handleAdd}>

          <input
            type="text"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />

          <input
            type="url"
            placeholder="Job Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <input
            type="text"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <button type="submit">Add</button>

        </form>


        {/* APPLICATION LIST */}

        <div className="applications-list">

          {applications.length === 0 ? (

            <p>No applications yet.</p>

          ) : (

            applications.map((app) => (

              <div key={app._id} className="application-card">

                <div className="application-info">

                  <h3>{app.company}</h3>

                  <p className="role">{app.role}</p>

                  {app.notes && (
                    <p className="notes">{app.notes}</p>
                  )}

                  <span className={`status ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>

                </div>


                {/* VIEW JOB BUTTON */}

                {app.link && (

                  <a
                    href={app.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="job-link"
                  >
                    View Job
                  </a>

                )}

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(app._id)}
                >
                  Delete
                </button>

              </div>

            ))

          )}

        </div>

      </main>

    </div>

  );
};

export default ApplicationPage;