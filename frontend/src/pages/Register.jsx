// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Form.css";

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!acceptedTerms) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Backend user registration via UserSerializer
      // We use email as both username and email field.
      const payload = {
        username: email,
        email: email,
        full_name: fullName,
        phone_number: phone,
        password: password,
      };

      await api.post("/api/user/register/", payload);

      alert("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Could not create account. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <h1>Create Account</h1>
        <p>Please fill in the details below to register.</p>

        <form onSubmit={handleSubmit}>
          <label>
            Full Name *
            <input
              type="text"
              className="form-input"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <label>
            Email *
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
            Phone Number *
            <input
              type="tel"
              className="form-input"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>

          <label>
            Password *
            <input
              type="password"
              className="form-input"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          <label>
            Confirm Password *
            <input
              type="password"
              className="form-input"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            I agree to the{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>
              Terms and Conditions
            </a>
            .
          </label>

          {error && (
            <p style={{ color: "red", marginTop: "8px", fontSize: "14px" }}>
              {error}
            </p>
          )}

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        <p>
          <Link to="/">Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
