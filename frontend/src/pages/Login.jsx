
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
  const [email, setEmail] = useState(""); // we treat email as username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // backend expects username + password → we use email as username
      const res = await api.post("/api/token/", {
        username: email,
        password,
      });

      localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refresh);
      localStorage.setItem(USERNAME_KEY, email);

      navigate("/home");
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
        <h1>Login</h1>
        <p>Enter your credentials to access your account.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Email Address *
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password *
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && (
            <p style={{ color: "red", marginTop: "8px", fontSize: "14px" }}>
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleForgotPassword}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "8px",
              marginBottom: "4px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              backgroundColor: "#f8f9fa",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Forgot Password?
          </button>

          <button
            type="submit"
            className="form-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don&apos;t have an account?{" "}
          <Link to="/register">Register here</Link>
        </p>

        <p>
          <Link to="/">Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
