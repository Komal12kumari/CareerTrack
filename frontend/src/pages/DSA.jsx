import { useEffect, useState } from "react";
import API from "../api/axios";
import "./DSA.css";

const DSA = () => {
  const [problems, setProblems] = useState([]);
  const [form, setForm] = useState({
    title: "",
    difficulty: "Easy",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch all problems
  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/problems");
      setProblems(res.data.problems);
    } catch (err) {
      setError("Failed to fetch problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  // ✅ Add problem
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Problem title is required");
      return;
    }

    try {
      await API.post("/api/problems", form);

      // Reset form
      setForm({ title: "", difficulty: "Easy" });

      // Refresh list
      fetchProblems();
    } catch (err) {
      setError(
        err.response?.data?.message || "Error adding problem"
      );
    }
  };

  // ✅ Delete problem
  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/problems/${id}`);
      fetchProblems();
    } catch (err) {
      setError("Error deleting problem");
    }
  };

  return (
    <div className="dsa-container">
      <h2>DSA Tracker 💻</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="dsa-form">
        <input
          type="text"
          placeholder="Problem Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <select
          value={form.difficulty}
          onChange={(e) =>
            setForm({ ...form, difficulty: e.target.value })
          }
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <button type="submit">Add</button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="problem-list">
          {problems.length === 0 ? (
            <p>No problems added yet.</p>
          ) : (
            problems.map((problem) => (
              <div key={problem._id} className="problem-card">
                <h4>{problem.title}</h4>
                <p>{problem.difficulty}</p>
                <button onClick={() => handleDelete(problem._id)}>
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DSA;