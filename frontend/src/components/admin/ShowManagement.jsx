import React, { useState, useEffect } from "react";
import api from "../../api";
import "../../styles/Admin.css";

function ShowManagement() {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedShowForSeats, setSelectedShowForSeats] = useState(null);
  const [showSeats, setShowSeats] = useState([]);
  const [theaterSeats, setTheaterSeats] = useState([]);
  const [formData, setFormData] = useState({
    movie: "",
    theater: "",
    showtime: "",
    price: "",
    is_active: true
  });
  const [showSeatForm, setShowSeatForm] = useState({
    seat: "",
    is_booked: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [showsRes, moviesRes, theatersRes] = await Promise.all([
        api.get("/api/shows/"),
        api.get("/api/movies/"),
        api.get("/api/theaters/")
      ]);
      setShows(showsRes.data);
      setMovies(moviesRes.data);
      setTheaters(theatersRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShowSeats = async (showId) => {
    try {
      const res = await api.get(`/api/show-seats/?show=${showId}`);
      setShowSeats(res.data);
    } catch (err) {
      console.error("Error fetching show seats:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleShowSeatInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShowSeatForm({
      ...showSeatForm,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate that movie and theater are selected
      if (!formData.movie || !formData.theater) {
        alert("Please select both a movie and theater");
        return;
      }
      
      // Don't parse as integer - they're UUIDs!
      const movieId = formData.movie;
      const theaterId = formData.theater;
      
      // Debug logging
      console.log("Form data:", formData);
      console.log("Movie ID:", movieId, "Theater ID:", theaterId);
      console.log("Available movies:", movies.map(m => ({ id: m.id, title: m.title })));
      console.log("Available theaters:", theaters.map(t => ({ id: t.id, name: t.name })));
      
      // Validate that the selected IDs actually exist
      const movieExists = movies.some(m => m.id === movieId);
      const theaterExists = theaters.some(t => t.id === theaterId);
      
      if (!movieExists) {
        alert(`Movie with ID ${movieId} not found in database`);
        return;
      }
      
      if (!theaterExists) {
        alert(`Theater with ID ${theaterId} not found in database`);
        return;
      }
      
      const data = {
        movie: movieId,
        theater: theaterId,
        showtime: formData.showtime,
        price: parseFloat(formData.price),
        is_active: formData.is_active
      };

      if (editingId) {
        await api.patch(`/api/shows/${editingId}/`, data);
        alert("Show updated successfully");
      } else {
        await api.post("/api/shows/", data);
        alert("Show created successfully");
      }

      setFormData({
        movie: "",
        theater: "",
        showtime: "",
        price: "",
        is_active: true
      });
      setShowForm(false);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Error saving show:", err);
      console.error("Response data:", err.response?.data);
      alert("Error: " + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
    }
  };

  const handleAddShowSeat = async (e) => {
    e.preventDefault();
    if (!selectedShowForSeats || !showSeatForm.seat) return;

    try {
      await api.post("/api/show-seats/", {
        show: selectedShowForSeats,
        seat: parseInt(showSeatForm.seat),
        is_booked: showSeatForm.is_booked
      });
      alert("Show seat added successfully");
      setShowSeatForm({ seat: "", is_booked: false });
      fetchData();
      fetchShowSeats(selectedShowForSeats);
    } catch (err) {
      console.error("Error adding show seat:", err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleDeleteShowSeat = async (showSeatId) => {
    if (!window.confirm("Are you sure you want to remove this seat from the show?"))
      return;

    try {
      await api.delete(`/api/show-seats/${showSeatId}/`);
      alert("Show seat removed successfully");
      fetchData();
      if (selectedShowForSeats) {
        fetchShowSeats(selectedShowForSeats);
      }
    } catch (err) {
      console.error("Error deleting show seat:", err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleToggleShowSeatBooked = async (showSeatId, currentStatus) => {
    try {
      await api.patch(`/api/show-seats/${showSeatId}/`, {
        is_booked: !currentStatus
      });
      alert("Show seat status updated");
      if (selectedShowForSeats) {
        fetchShowSeats(selectedShowForSeats);
      }
    } catch (err) {
      console.error("Error updating show seat:", err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleEdit = (show) => {
    // Format datetime for datetime-local input (YYYY-MM-DDTHH:mm)
    const datetimeLocal = show.showtime.slice(0, 16);
    setFormData({
      movie: String(show.movie),
      theater: String(show.theater),
      showtime: datetimeLocal,
      price: String(show.price),
      is_active: show.is_active
    });
    setEditingId(show.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this show?")) return;

    try {
      await api.delete(`/api/shows/${id}/`);
      alert("Show deleted successfully");
      fetchData();
    } catch (err) {
      console.error("Error deleting show:", err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleManageSeats = (show) => {
    setSelectedShowForSeats(show.id);
    const theater = theaters.find(t => t.id === show.theater);
    if (theater && theater.seats) {
      setTheaterSeats(theater.seats);
    }
    fetchShowSeats(show.id);
  };

  const handleCloseShowSeatManager = () => {
    setSelectedShowForSeats(null);
    setShowSeats([]);
    setTheaterSeats([]);
  };

  const getMovieName = (movieId) => {
    return movies.find(m => m.id === movieId)?.title || "Unknown";
  };

  const getTheaterName = (theaterId) => {
    return theaters.find(t => t.id === theaterId)?.name || "Unknown";
  };

  const getUsedSeats = () => {
    return showSeats.map(ss => ss.seat);
  };

  if (loading) return <div className="loading">Loading shows...</div>;

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Show Management</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              movie: "",
              theater: "",
              showtime: "",
              price: "",
              is_active: true
            });
          }}
        >
          {showForm ? "Cancel" : "Add New Show"}
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h3>{editingId ? "Edit Show" : "Add New Show"}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Movie *</label>
                <select
                  name="movie"
                  value={formData.movie}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Movie</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Theater *</label>
                <select
                  name="theater"
                  value={formData.theater}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Theater</option>
                  {theaters.map((theater) => (
                    <option key={theater.id} value={theater.id}>
                      {theater.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Show Time *</label>
                <input
                  type="datetime-local"
                  name="showtime"
                  value={formData.showtime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                Active
              </label>
            </div>

            <button type="submit" className="btn-primary">
              {editingId ? "Update Show" : "Create Show"}
            </button>
          </form>
        </div>
      )}

      <div className="shows-list">
        {shows.length === 0 ? (
          <p>No shows found. Create one to get started.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Theater</th>
                <th>Show Time</th>
                <th>Price</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show) => (
                <tr key={show.id}>
                  <td>{getMovieName(show.movie)}</td>
                  <td>{getTheaterName(show.theater)}</td>
                  <td>{new Date(show.showtime).toLocaleString()}</td>
                  <td>${parseFloat(show.price).toFixed(2)}</td>
                  <td>{show.is_active ? "✓" : "✗"}</td>
                  <td>
                    <button
                      className="btn-small btn-edit"
                      onClick={() => handleEdit(show)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-small btn-info"
                      onClick={() => handleManageSeats(show)}
                    >
                      Manage Seats
                    </button>
                    <button
                      className="btn-small btn-delete"
                      onClick={() => handleDelete(show.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Show Seat Management Modal */}
      {selectedShowForSeats && (
        <div className="modal-overlay" onClick={handleCloseShowSeatManager}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "700px", maxHeight: "80vh", overflowY: "auto" }}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={handleCloseShowSeatManager}
            >
              ×
            </button>

            <h3>
              Manage Show Seats -{" "}
              {getMovieName(shows.find(s => s.id === selectedShowForSeats)?.movie)} @{" "}
              {getTheaterName(shows.find(s => s.id === selectedShowForSeats)?.theater)}
            </h3>

            <div className="form-section">
              <h4>Add Seat to Show</h4>
              <form onSubmit={handleAddShowSeat} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Seat *</label>
                    <select
                      name="seat"
                      value={showSeatForm.seat}
                      onChange={handleShowSeatInputChange}
                      required
                    >
                      <option value="">Select Seat</option>
                      {theaterSeats.map((seat) => (
                        <option
                          key={seat.id}
                          value={seat.id}
                          disabled={getUsedSeats().includes(seat.id)}
                        >
                          {seat.seat_number} ({seat.seat_type})
                          {getUsedSeats().includes(seat.id) ? " - Already Added" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ marginTop: "25px" }}>
                      <input
                        type="checkbox"
                        name="is_booked"
                        checked={showSeatForm.is_booked}
                        onChange={handleShowSeatInputChange}
                      />
                      Mark as Booked
                    </label>
                  </div>
                </div>
                <button type="submit" className="btn-primary">
                  Add Seat
                </button>
              </form>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h4>Show Seats ({showSeats.length})</h4>
              {showSeats.length === 0 ? (
                <p>No seats assigned to this show yet.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Seat Number</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showSeats.map((showSeat) => {
                      const seat = theaterSeats.find(s => s.id === showSeat.seat);
                      return (
                        <tr key={showSeat.id}>
                          <td>{seat?.seat_number}</td>
                          <td>{seat?.seat_type}</td>
                          <td>
                            <span
                              className={`status-badge ${
                                showSeat.is_booked ? "status-booked" : "status-available"
                              }`}
                            >
                              {showSeat.is_booked ? "Booked" : "Available"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn-small btn-info"
                              onClick={() =>
                                handleToggleShowSeatBooked(
                                  showSeat.id,
                                  showSeat.is_booked
                                )
                              }
                            >
                              Toggle
                            </button>
                            <button
                              className="btn-small btn-delete"
                              onClick={() => handleDeleteShowSeat(showSeat.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button
                className="btn-secondary"
                onClick={handleCloseShowSeatManager}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowManagement;
