import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USERNAME_KEY,
} from "../constants";
import "../styles/Form.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/token/", {
        username: email,
        password,
      });

      localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refresh);
      localStorage.setItem(USERNAME_KEY, email);

      navigate("/catalog"); // redirect after login
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Password reset is not implemented for this project demo.");
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h1 className="form-title">Login</h1>
        <p className="form-subtitle">Enter your credentials to access your account.</p>

        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password */}
          <p className="forgot-password">
            <button
              type="button"
              className="forgot-password-btn"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </p>

          {/* Error Message */}
          {error && <p className="error-text">{error}</p>}

          {/* Login Button */}
          <button type="submit" className="form-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="form-footer">
          Don’t have an account?{" "}
          <Link className="form-link" to="/register">Register here</Link>
        </p>

        <p className="form-footer">
          <Link className="form-link" to="/">Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
