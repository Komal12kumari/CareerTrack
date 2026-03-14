import { useState, useEffect } from "react";
import API from "../api/axios";
import "./DSATracker.css";
import { useNavigate, useLocation } from "react-router-dom";

const DSATracker = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [problems, setProblems] = useState([]);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [topic, setTopic] = useState("Array");
  const [link, setLink] = useState("");

  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const fetchProblems = async () => {
    try {
      const res = await API.get("/api/problems");
      setProblems(res.data?.problems || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const addProblem = async () => {
    if (!title.trim()) return;

    try {
      await API.post("/api/problems", {
        title,
        difficulty,
        topic,
        link,
      });

      setTitle("");
      setLink("");
      setTopic("Array");

      fetchProblems();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProblem = async (id) => {
    try {
      await API.delete(`/api/problems/${id}`);
      fetchProblems();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSolved = async (id, currentStatus) => {
    try {
      await API.put(`/api/problems/${id}`, {
        isSolved: !currentStatus,
      });
      fetchProblems();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const matchSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchDifficulty =
      filterDifficulty === "All" || problem.difficulty === filterDifficulty;

    return matchSearch && matchDifficulty;
  });

  const solvedCount = problems.filter((p) => p.isSolved).length;

  const progressPercent =
    problems.length === 0 ? 0 : (solvedCount / problems.length) * 100;

  return (
    <div className={`dashboard ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      
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

      <main className="main-content">

        <button
          className="toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "✖" : "☰"}
        </button>

        <h1 className="tracker-title">DSA Problem Tracker</h1>

        <div className="progress-section">
          <p>
            Solved <b>{solvedCount}</b> / {problems.length}
          </p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="search-filter">

          <input
            type="text"
            placeholder="Search problem..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

        </div>

        <div className="add-problem-card">

          <input
            type="text"
            placeholder="Problem Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            <option>Array</option>
            <option>String</option>
            <option>Linked List</option>
            <option>Stack</option>
            <option>Queue</option>
            <option>Binary Search</option>
            <option>Tree</option>
            <option>Graph</option>
            <option>Dynamic Programming</option>
            <option>Greedy</option>
          </select>

          <input
            type="text"
            placeholder="Problem Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          <button onClick={addProblem}>Add Problem</button>

        </div>

        <div className="problem-list">

          {filteredProblems.length === 0 ? (
            <p className="empty-msg">No problems found</p>
          ) : (

            filteredProblems.map((problem) => (

              <div key={problem._id} className="problem-card">

                <div className="problem-info">

                  <div className="problem-text">

                    <div className="title-row">
                      <h3>{problem.title}</h3>

                      <span
                        className={`difficulty ${problem.difficulty.toLowerCase()}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    {problem.topic && (
                      <p className="topic-tag">
                        {problem.topic}
                      </p>
                    )}

                  </div>

                </div>

                <div className="problem-actions">

                  {problem.link && (
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="solve-btn"
                    >
                      Solve
                    </a>
                  )}

                  <button
                    className={problem.isSolved ? "solved-btn" : "mark-btn"}
                    onClick={() =>
                      toggleSolved(problem._id, problem.isSolved)
                    }
                  >
                    {problem.isSolved ? "Solved ✔" : "Mark Solved"}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteProblem(problem._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))
          )}

        </div>

      </main>
    </div>
  );
};

export default DSATracker;