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
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/user/me/");
        setProfile({
          fullName: res.data.full_name || "",
          email: res.data.email || "",
          phoneNumber: res.data.phone_number || "",
          address: res.data.address || "",
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((p) => ({ ...p, [name]: value }));
  };

  // Save profile
  const handleSaveProfile = async () => {
    setError("");
    setSuccess("");
    setSavingProfile(true);
    try {
      await api.patch("/api/user/update-profile/", {
        full_name: profile.fullName,
        phone_number: profile.phoneNumber,
        address: profile.address,
      });
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
      console.error("Error updating profile:", err);
    } finally {
      setSavingProfile(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    setError("");
    setSuccess("");

    // Client-side validation first
    if (!passwordData.oldPassword) {
      setError("Please enter your current password");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setChangingPassword(true);
    try {
      await api.post("/api/user/change-password/", {
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
        confirm_password: passwordData.confirmPassword,
      });
      setSuccess("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePassword(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
      console.error("Error changing password:", err);
    } finally {
      setChangingPassword(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN_KEY");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="form-page">
        <div className="form-container">
          <p style={{ textAlign: "center", color: "#94a3b8" }}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-container profile-card">
        <h2 className="form-title">Edit Profile</h2>
        <p className="form-subtitle">
          View and manage your account information
        </p>

        {/* ===== USER PROFILE SECTION ===== */}
        <div className="profile-section" style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#f1f5f9", marginTop: 0 }}>Account Information</h3>

          {/* full Name */}
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

          {/* Address */}
          <label className="form-label">Address</label>
          <textarea
            className="form-input"
            name="address"
            value={profile.address}
            disabled={!isEditing}
            onChange={handleChange}
            style={{ minHeight: "80px", resize: "vertical" }}
          />

          <button
            type="button"
            className="form-button"
            style={{ background: isEditing ? "#10b981" : "#2563eb" }}
            onClick={() => {
              if (!isEditing) {
                setIsEditing(true);
              } else {
                handleSaveProfile();
              }
            }}
            disabled={savingProfile}
          >
            {savingProfile ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="form-button"
              style={{ background: "#6b7280", marginTop: "10px" }}
              onClick={() => setIsEditing(false)}
              disabled={savingProfile}
            >
              Cancel
            </button>
          )}

          {/* error and success msg for profile */}
          {error && !showChangePassword && (
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              color: "#fca5a5",
              padding: "12px",
              borderRadius: "8px",
              marginTop: "16px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
            }}>
              {error}
            </div>
          )}
          {success && !showChangePassword && (
            <div style={{
              background: "rgba(34, 197, 94, 0.1)",
              color: "#86efac",
              padding: "12px",
              borderRadius: "8px",
              marginTop: "16px",
              border: "1px solid rgba(34, 197, 94, 0.3)",
            }}>
              {success}
            </div>
          )}
        </div>

        {/* section to change password */}
        <div className="profile-section" style={{ marginBottom: "20px" }}>
          <h3 style={{ color: "#f1f5f9", marginTop: 0 }}>Security</h3>
          
          {!showChangePassword ? (
            <button
              type="button"
              className="form-button"
              style={{ background: "#2563eb" }}
              onClick={() => setShowChangePassword(true)}
            >
              Change Password
            </button>
          ) : (
            <>
              {/* current password */}
              <label className="form-label">Current Password</label>
              <div className="password-field" style={{ marginBottom: "16px" }}>
                <input
                  className="form-input"
                  type={showPassword.current ? "text" : "password"}
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(p => ({ ...p, current: !p.current }))}
                >
                  {showPassword.current ? "🙈" : "👁️"}
                </button>
              </div>

              {/* new Pasword */}
              <label className="form-label">New Password</label>
              <div className="password-field" style={{ marginBottom: "16px" }}>
                <input
                  className="form-input"
                  type={showPassword.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(p => ({ ...p, new: !p.new }))}
                >
                  {showPassword.new ? "🙈" : "👁️"}
                </button>
              </div>

              {/* confirm the Password */}
              <label className="form-label">Confirm New Password</label>
              <div className="password-field" style={{ marginBottom: "16px" }}>
                <input
                  className="form-input"
                  type={showPassword.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(p => ({ ...p, confirm: !p.confirm }))}
                >
                  {showPassword.confirm ? "🙈" : "👁️"}
                </button>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="button"
                  className="form-button"
                  style={{ background: "#10b981", flex: 1, opacity: changingPassword ? 0.6 : 1 }}
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                >
                  {changingPassword ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  className="form-button"
                  style={{ background: "#6b7280", flex: 1 }}
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                    setError("");
                  }}
                  disabled={changingPassword}
                >
                  Cancel
                </button>
              </div>

              {/* error and Success msg for Password */}
              {error && showChangePassword && (
                <div style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#fca5a5",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "16px",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                }}>
                  {error}
                </div>
              )}
              {success && showChangePassword && (
                <div style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  color: "#86efac",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "16px",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                }}>
                  {success}
                </div>
              )}
            </>
          )}
        </div>

        {/* buttons */}
        <div style={{ marginTop: "30px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            type="button"
            className="form-button"
            style={{ background: "#dc2626", flex: 1 }}
            onClick={handleLogout}
          >
            Logout
          </button>

          <button
            type="button"
            className="form-link-button"
            style={{ flex: 1, color: "#60a5fa" }}
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
