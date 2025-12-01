import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Admin.css";
import MovieManagement from "../components/admin/MovieManagement";
import TheaterManagement from "../components/admin/TheaterManagement";
import ShowManagement from "../components/admin/ShowManagement";
import TicketManagement from "../components/admin/TicketManagement";
import ReviewManagement from "../components/admin/ReviewManagement";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    total_users: 0,
    total_movies: 0,
    total_bookings: 0,
    total_revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch basic stats
      const [moviesRes, ticketsRes] = await Promise.all([
        api.get("/api/movies/"),
        api.get("/api/tickets/")
      ]);

      const totalRevenue = ticketsRes.data
        .filter(t => t.status === 'paid')
        .reduce((sum, t) => sum + parseFloat(t.total_price), 0);

      setStats({
        total_movies: moviesRes.data.length,
        total_bookings: ticketsRes.data.length,
        total_revenue: totalRevenue.toFixed(2),
        total_users: 0 // Would need a separate endpoint
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1 onClick={() => navigate("/catalog")} style={{ cursor: "pointer", margin: 0 }}>
            Admin Dashboard
          </h1>
          <p>Manage movies, theaters, shows, and bookings</p>
        </div>
        <div className="admin-header-right">
          <button
            className="btn-nav"
            onClick={() => navigate("/catalog")}
          >
            Back to Catalog
          </button>
          <button
            className="btn-logout"
            onClick={() => {
              localStorage.removeItem("ACCESS_TOKEN_KEY");
              localStorage.removeItem("REFRESH_TOKEN_KEY");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`tab-btn ${activeTab === "movies" ? "active" : ""}`}
          onClick={() => setActiveTab("movies")}
        >
          Movies
        </button>
        <button
          className={`tab-btn ${activeTab === "theaters" ? "active" : ""}`}
          onClick={() => setActiveTab("theaters")}
        >
          Theaters
        </button>
        <button
          className={`tab-btn ${activeTab === "shows" ? "active" : ""}`}
          onClick={() => setActiveTab("shows")}
        >
          Shows
        </button>
        <button
          className={`tab-btn ${activeTab === "tickets" ? "active" : ""}`}
          onClick={() => setActiveTab("tickets")}
        >
          Tickets
        </button>
        <button
          className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
      </div>

      {/* Content Area */}
      <div className="admin-content">
        {activeTab === "dashboard" && (
          <div className="dashboard-section">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Movies</div>
                <div className="stat-value">{stats.total_movies}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Bookings</div>
                <div className="stat-value">{stats.total_bookings}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Revenue</div>
                <div className="stat-value">${stats.total_revenue}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "movies" && <MovieManagement />}
        {activeTab === "theaters" && <TheaterManagement />}
        {activeTab === "shows" && <ShowManagement />}
        {activeTab === "tickets" && <TicketManagement />}
        {activeTab === "reviews" && <ReviewManagement />}
      </div>
    </div>
  );
}

export default AdminDashboard;
