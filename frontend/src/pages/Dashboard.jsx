import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [analytics, setAnalytics] = useState(null);
  const [appAnalytics, setAppAnalytics] = useState(null);
  const [streak, setStreak] = useState(0);

  const [userName, setUserName] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showToggle, setShowToggle] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Get user name from token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.name);
      } catch (error) {
        console.log("Invalid token");
      }
    }
  }, []);

  // Fetch Analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const [dsaRes, appRes, streakRes] = await Promise.all([
          axios.get("http://localhost:5000/api/problems/analytics", {
            headers: { Authorization: `Bearer ${token}` },
          }),

          axios.get("http://localhost:5000/api/applications/analytics", {
            headers: { Authorization: `Bearer ${token}` },
          }),

          axios.get("http://localhost:5000/api/problems/streak", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAnalytics(dsaRes.data);
        setAppAnalytics(appRes.data);
        setStreak(streakRes.data.streak);

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate]);

  // Hide toggle button on scroll
  useEffect(() => {
    let lastScroll = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScroll) {
        setShowToggle(false);
      } else {
        setShowToggle(true);
      }
      lastScroll = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading dashboard...</h2>;
  }

  if (error) {
    return <h2 style={{ padding: "20px", color: "red" }}>{error}</h2>;
  }

  const dsaChartData = [
    { name: "Easy", count: analytics?.easy || 0 },
    { name: "Medium", count: analytics?.medium || 0 },
    { name: "Hard", count: analytics?.hard || 0 },
  ];

  const appChartData = [
    { name: "Applied", count: appAnalytics?.applied || 0 },
    { name: "Interview", count: appAnalytics?.interview || 0 },
    { name: "Offer", count: appAnalytics?.offer || 0 },
    { name: "Rejected", count: appAnalytics?.rejected || 0 },
  ];

  return (
    <div className={`dashboard ${sidebarOpen ? "" : "sidebar-collapsed"}`}>

      {/* Sidebar */}
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

      {/* Main */}
      <main className="main-content">

        {showToggle && (
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "✖" : "☰"}
          </button>
        )}

        <h1>Welcome Back, {userName}...</h1>
        <p className="subtitle">
          Overview of your DSA & Job Application Progress
        </p>

        {/* Progress */}
        <div className="progress-section">

          <h3>Problem Solving Progress</h3>

          <div className="progress-circle">
            <CircularProgressbar
              value={analytics?.solvedPercentage || 0}
              text={`${analytics?.solvedPercentage || 0}%`}
            />
          </div>

          <p>
            {analytics?.totalSolved || 0} / {analytics?.totalProblems || 0} solved
          </p>

        </div>

        {/* DSA Stats */}
        <h2>DSA Analytics</h2>

        <div className="cards">

          <div className="card total">
            <h3>Total Problems</h3>
            <p>{analytics?.totalProblems || 0}</p>
          </div>

          <div className="card easy">
            <h3>Easy</h3>
            <p>{analytics?.easy || 0}</p>
          </div>

          <div className="card medium">
            <h3>Medium</h3>
            <p>{analytics?.medium || 0}</p>
          </div>

          <div className="card hard">
            <h3>Hard</h3>
            <p>{analytics?.hard || 0}</p>
          </div>

          <div className="card solved">
            <h3>Solved</h3>
            <p>{analytics?.totalSolved || 0}</p>
          </div>

          <div className="card percentage">
            <h3>Solved %</h3>
            <p>{analytics?.solvedPercentage || 0}%</p>
          </div>

          {/* ⭐ NEW STREAK CARD */}
          <div className="card streak">
            <h3>🔥 Current Streak</h3>
            <p>{streak} days..</p>
          </div>

        </div>

        {/* DSA Chart */}
        <div className="chart-box">

          <h3>Difficulty Breakdown</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dsaChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* Application Analytics */}
        <h2 style={{ marginTop: "50px" }}>Application Analytics</h2>

        <div className="cards">

          <div className="card total">
            <h3>Total Applications</h3>
            <p>{appAnalytics?.total || 0}</p>
          </div>

          <div className="card applied">
            <h3>Applied</h3>
            <p>{appAnalytics?.applied || 0}</p>
          </div>

          <div className="card medium">
            <h3>Interview</h3>
            <p>{appAnalytics?.interview || 0}</p>
          </div>

          <div className="card easy">
            <h3>Offers</h3>
            <p>{appAnalytics?.offer || 0}</p>
          </div>

          <div className="card hard">
            <h3>Rejected</h3>
            <p>{appAnalytics?.rejected || 0}</p>
          </div>

        </div>

        {/* Application Chart */}
        <div className="chart-box">

          <h3>Application Status Breakdown</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;