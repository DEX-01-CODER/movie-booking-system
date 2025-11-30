// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Form.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/user/me/");

        setProfile({
          fullName: res.data.full_name || "",
          email: res.data.email || "",
          phoneNumber: res.data.phone_number || "",
        });
      } catch (err) {
        console.error("Profile load error:", err);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  // Edit / Save button
  const handleEditClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      // later you can send PATCH to backend
      alert("Saving profile to backend is not implemented yet.");
      setIsEditing(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN_KEY");
    navigate("/login");
  };

  const handleBackHome = () => navigate("/home");

  if (loading) {
    return (
      <div className="form-page">
        <div className="form-card">
          <p style={{ textAlign: "center", color: "white" }}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-card profile-card">
        <h2 className="form-title">Edit Profile</h2>
        <p className="form-subtitle">
          View and manage your account information
        </p>

        {/* ===== USER PROFILE SECTION ===== */}
        <div className="profile-section">
          {/* Full Name */}
          <label className="form-label">Full Name</label>
          <input
            className="form-input"
            type="text"
            name="fullName"
            value={profile.fullName}
            disabled={!isEditing}
            onChange={handleChange}
          />

          {/* Email */}
          <label className="form-label">
            Email Address{" "}
            <span style={{ fontWeight: 400 }}>(cannot be changed)</span>
          </label>
          <input
            className="form-input"
            type="email"
            name="email"
            value={profile.email}
            disabled
          />

          {/* Phone Number */}
          <label className="form-label">Phone Number</label>
          <input
            className="form-input"
            type="text"
            name="phoneNumber"
            value={profile.phoneNumber}
            disabled={!isEditing}
            onChange={handleChange}
          />

          {/* Password field with eye icon (placeholder only) */}
          <label className="form-label">Password</label>
          <div className="password-field">
            <input
              className="form-input"
              type={showPassword ? "text" : "password"}
              name="password"
              value="••••••••••"
              disabled
              readOnly
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="button"
            className="form-button primary"
            onClick={handleEditClick}
          >
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            type="button"
            className="form-button danger"
            onClick={handleLogout}
          >
            Logout
          </button>

          <button
            type="button"
            className="form-link-button"
            onClick={() => navigate("/catalog")}
          >
            Back to Catalog
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
