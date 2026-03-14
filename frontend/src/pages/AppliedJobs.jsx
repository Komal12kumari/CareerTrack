import { useEffect, useState } from "react";
import axios from "axios";

const AppliedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    const res = await axios.get("http://localhost:5000/api/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setJobs(res.data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const addJob = async () => {
    await axios.post(
      "http://localhost:5000/api/jobs/add",
      { company, role, status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchJobs();
    setCompany("");
    setRole("");
  };

  const deleteJob = async (id) => {
    await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchJobs();
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Applied Jobs</h2>

      {/* Add Job Form */}

      <input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Applied</option>
        <option>Interview</option>
        <option>Rejected</option>
        <option>Offer</option>
      </select>

      <button onClick={addJob}>Add Job</button>

      <hr />

      {/* Jobs Table */}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.company}</td>
              <td>{job.role}</td>
              <td>{job.status}</td>

              <td>
                <button onClick={() => deleteJob(job._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppliedJobs;