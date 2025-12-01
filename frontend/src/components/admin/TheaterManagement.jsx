import React, { useState, useEffect } from "react";
import api from "../../api";
import "../../styles/Admin.css";

function TheaterManagement() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedTheaterForSeats, setSelectedTheaterForSeats] = useState(null);
  const [seats, setSeats] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    total_seats: ""
  });
  const [seatForm, setSeatForm] = useState({
    seat_number: "",
    seat_type: "regular"
  });

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/theaters/");
      setTheaters(res.data);
    } catch (err) {
      console.error("Error fetching theaters:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeats = async (theaterId) => {
    try {
      const theater = theaters.find(t => t.id === theaterId);
      if (theater && theater.seats) {
        setSeats(theater.seats);
      }
    } catch (err) {
      console.error("Error fetching seats:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSeatInputChange = (e) => {
    const { name, value } = e.target;
    setSeatForm({
      ...seatForm,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        total_seats: parseInt(formData.total_seats)
      };

      if (editingId) {
        await api.patch(`/api/theaters/${editingId}/`, data);
        alert("Theater updated successfully");
      } else {
        await api.post("/api/theaters/", data);
        alert("Theater created successfully");
      }

      setFormData({
        name: "",
        address: "",
        total_seats: ""
      });
      setShowForm(false);
      setEditingId(null);
      fetchTheaters();
    } catch (err) {
      console.error("Error saving theater:", err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleAddSeat = async (e) => {
    e.preventDefault();
    if (!selectedTheaterForSeats) return;
    if (!seatForm.seat_number || !seatForm.seat_type) {
      alert("Please fill in all seat fields");
      return;
    }

    try {
      // Ensure theater ID is a string (UUID)
      const theaterIdString = String(selectedTheaterForSeats);
      const seatData = {
        theater: theaterIdString,
        seat_number: String(seatForm.seat_number).trim(),
        seat_type: String(seatForm.seat_type).trim()
      };
      console.log("Adding seat with:", seatData);
      await api.post("/api/seats/", seatData);
      alert("Seat added successfully");
      setSeatForm({ seat_number: "", seat_type: "regular" });
      fetchTheaters();
      fetchSeats(selectedTheaterForSeats);
    } catch (err) {
      console.error("Error adding seat:", err);
      console.error("Error response:", err.response?.data);
      alert("Error: " + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
    }
  };

  const handleDeleteSeat = async (seatId) => {
    if (!window.confirm("Are you sure you want to delete this seat?")) return;

    try {
      await api.delete(`/api/seats/${seatId}/`);
      alert("Seat deleted successfully");
      fetchTheaters();
      if (selectedTheaterForSeats) {
        fetchSeats(selectedTheaterForSeats);
      }
    } catch (err) {
      console.error("Error deleting seat:", err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleEdit = (theater) => {
    setFormData(theater);
    setEditingId(theater.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this theater?")) return;

    try {
      await api.delete(`/api/theaters/${id}/`);
      alert("Theater deleted successfully");
      fetchTheaters();
    } catch (err) {
      console.error("Error deleting theater:", err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleManageSeats = (theater) => {
    setSelectedTheaterForSeats(theater.id);
    fetchSeats(theater.id);
  };

  const handleCloseSeatManager = () => {
    setSelectedTheaterForSeats(null);
    setSeats([]);
  };

  if (loading) return <div className="loading">Loading theaters...</div>;

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Theater Management</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: "",
              address: "",
              total_seats: ""
            });
          }}
        >
          {showForm ? "Cancel" : "Add New Theater"}
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h3>{editingId ? "Edit Theater" : "Add New Theater"}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-group">
              <label>Theater Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Total Seats *</label>
              <input
                type="number"
                name="total_seats"
                value={formData.total_seats}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              {editingId ? "Update Theater" : "Create Theater"}
            </button>
          </form>
        </div>
      )}

      <div className="theaters-list">
        {theaters.length === 0 ? (
          <p>No theaters found. Create one to get started.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Total Seats</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {theaters.map((theater) => (
                <tr key={theater.id}>
                  <td>{theater.name}</td>
                  <td>{theater.address}</td>
                  <td>{theater.total_seats}</td>
                  <td>
                    <button
                      className="btn-small btn-edit"
                      onClick={() => handleEdit(theater)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-small btn-info"
                      onClick={() => handleManageSeats(theater)}
                    >
                      Manage Seats
                    </button>
                    <button
                      className="btn-small btn-delete"
                      onClick={() => handleDelete(theater.id)}
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

      {/* Seat Management Modal */}
      {selectedTheaterForSeats && (
        <div className="modal-overlay" onClick={handleCloseSeatManager}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px", maxHeight: "80vh", overflowY: "auto" }}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={handleCloseSeatManager}
            >
              ×
            </button>

            <h3>Manage Seats - {theaters.find(t => t.id === selectedTheaterForSeats)?.name}</h3>

            <div className="form-section">
              <h4>Add New Seat</h4>
              <form onSubmit={handleAddSeat} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Seat Number *</label>
                    <input
                      type="text"
                      name="seat_number"
                      value={seatForm.seat_number}
                      onChange={handleSeatInputChange}
                      placeholder="e.g., A1, B5"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Seat Type *</label>
                    <select
                      name="seat_type"
                      value={seatForm.seat_type}
                      onChange={handleSeatInputChange}
                    >
                      <option value="regular">Regular</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn-primary">Add Seat</button>
              </form>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h4>Existing Seats ({seats.length})</h4>
              {seats.length === 0 ? (
                <p>No seats added yet.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Seat Number</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seats.map((seat) => (
                      <tr key={seat.id}>
                        <td>{seat.seat_number}</td>
                        <td>{seat.seat_type}</td>
                        <td>
                          <button
                            className="btn-small btn-delete"
                            onClick={() => handleDeleteSeat(seat.id)}
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

            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button
                className="btn-secondary"
                onClick={handleCloseSeatManager}
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

export default TheaterManagement;
