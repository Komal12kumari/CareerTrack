import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResumeUpload.css";

const ResumePage = () => {

  const [file, setFile] = useState(null);
  const [role, setRole] = useState("");

  const [skills, setSkills] = useState([]);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);

  const navigate = useNavigate();

  /* Available Roles */

  const roles = [
    "Frontend Intern",
    "Backend Intern",
    "Full Stack Intern",
    "Data Analyst Intern"
  ];


  /* Upload Resume */

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a resume");
      return;
    }

    if (!role) {
      alert("Please select a role");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);

    try {

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setSkills(res.data.skills || []);
      setMatchedSkills(res.data.matchedSkills || []);
      setMissingSkills(res.data.missingSkills || []);

      alert("Resume analyzed successfully");

    } catch (error) {

      console.log(error);
      alert("Upload failed");

    }

  };


  /* View Resume */

  const handleView = async () => {

    try {

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/resume",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.data.fileUrl) {
        alert("No resume uploaded");
        return;
      }

      window.open(`http://localhost:5000/${res.data.fileUrl}`, "_blank");

    } catch (error) {

      console.log(error);
      alert("Resume not found");

    }

  };


  /* Delete Resume */

  const handleDelete = async () => {

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        "http://localhost:5000/api/resume",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSkills([]);
      setMatchedSkills([]);
      setMissingSkills([]);
      setRole("");

      alert("Resume deleted");

    } catch (error) {

      console.log(error);
      alert("Delete failed");

    }

  };


  return (

    <div className="resume-container">

      <button
        className="resume-back"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="resume-header">

        <h1>Resume Skill Analyzer</h1>
        <p>Upload your resume and analyze skills for your target role</p>

      </div>

      <div className="resume-grid">

        {/* Upload Section */}

        <div className="resume-card">

          <h2>Upload Resume</h2>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* Dropdown Role */}

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >

            <option value="">Select Target Role</option>

            {roles.map((r, index) => (
              <option key={index} value={r}>
                {r}
              </option>
            ))}

          </select>


          <div className="resume-buttons">

            <button onClick={handleUpload}>
              Upload
            </button>

            <button className="view-btn" onClick={handleView}>
              View
            </button>

            <button className="delete-btn" onClick={handleDelete}>
              Delete
            </button>

          </div>

        </div>


        {/* Detected Skills */}

        <div className="resume-card">

          <h2>Detected Skills</h2>

          <div className="skill-container">

            {skills.length === 0 && <p>No skills detected yet</p>}

            {skills.map((skill, index) => (
              <span className="skill-badge" key={index}>
                {skill}
              </span>
            ))}

          </div>

        </div>


        {/* Matching Skills */}

        <div className="resume-card">

          <h2>Skills Matching Role</h2>

          <div className="skill-container">

            {matchedSkills.length === 0 && <p>No matched skills yet</p>}

            {matchedSkills.map((skill, index) => (
              <span className="skill-badge matched" key={index}>
                {skill}
              </span>
            ))}

          </div>

        </div>


        {/* Missing Skills */}

        <div className="resume-card">

          <h2>Skills To Learn</h2>

          <div className="skill-container">

            {missingSkills.length === 0 && <p>No missing skills 🎉</p>}

            {missingSkills.map((skill, index) => (
              <span className="skill-badge missing" key={index}>
                {skill}
              </span>
            ))}

          </div>

        </div>

      </div>

    </div>

  );

};

export default ResumePage;