import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DSATracker from "./pages/DSATracker";
import ApplicationPage from "./pages/ApplicationPage";
import ResumeUpload from "./pages/ResumeUpload";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>

      <Routes>

        {/* ---------- Public Routes ---------- */}

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* ---------- Protected Routes ---------- */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dsa"
          element={
            <ProtectedRoute>
              <DSATracker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ApplicationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumeUpload />
            </ProtectedRoute>
          }
        />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>

    </Router>
  );
}

export default App;