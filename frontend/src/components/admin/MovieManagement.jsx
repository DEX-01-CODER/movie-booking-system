import React, { useState, useEffect } from "react";
import api from "../../api";
import "../../styles/Admin.css";

function MovieManagement() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    runtime_minutes: "",
    release_date: "",
    rating: "0.0",
    poster_url: "",
    trailer_url: "",
    is_current: true,
    cast: ""
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/movies/");
      setMovies(res.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        runtime_minutes: parseInt(formData.runtime_minutes),
        rating: parseFloat(formData.rating),
        cast: formData.cast.split(',').map(c => c.trim()).filter(c => c)
      };

      if (editingId) {
        await api.patch(`/api/movies/${editingId}/`, data);
        alert("Movie updated successfully");
      } else {
        await api.post("/api/movies/", data);
        alert("Movie created successfully");
      }

      setFormData({
        title: "",
        description: "",
        genre: "",
        runtime_minutes: "",
        release_date: "",
        rating: "0.0",
        poster_url: "",
        trailer_url: "",
        is_current: true,
        cast: ""
      });
      setShowForm(false);
      setEditingId(null);
      fetchMovies();
    } catch (err) {
      console.error("Error saving movie:", err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleEdit = (movie) => {
    setFormData({
      ...movie,
      cast: Array.isArray(movie.cast) ? movie.cast.join(", ") : ""
    });
    setEditingId(movie.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      await api.delete(`/api/movies/${id}/`);
      alert("Movie deleted successfully");
      fetchMovies();
    } catch (err) {
      console.error("Error deleting movie:", err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <div className="loading">Loading movies...</div>;

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Movie Management</h2>
        <button
          className="btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              title: "",
              synopsis: "",
              genre: "",
              runtime_minutes: "",
              release_date: "",
              rating: "0.0",
              poster_url: "",
              trailer_url: "",
              is_current: true,
              cast: ""
            });
          }}
        >
          {showForm ? "Cancel" : "Add New Movie"}
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <h3>{editingId ? "Edit Movie" : "Add New Movie"}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Genre *</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Release Date *</label>
                <input
                  type="date"
                  name="release_date"
                  value={formData.release_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Runtime (minutes) *</label>
                <input
                  type="number"
                  name="runtime_minutes"
                  value={formData.runtime_minutes}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rating</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="5"
                />
              </div>
              <div className="form-group">
                <label>Is Current</label>
                <input
                  type="checkbox"
                  name="is_current"
                  checked={formData.is_current}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label>Poster URL *</label>
              <input
                type="url"
                name="poster_url"
                value={formData.poster_url}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Trailer URL</label>
              <input
                type="url"
                name="trailer_url"
                value={formData.trailer_url}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Cast (comma-separated)</label>
              <input
                type="text"
                name="cast"
                value={formData.cast}
                onChange={handleInputChange}
                placeholder="e.g., Actor 1, Actor 2, Actor 3"
              />
            </div>

            <button type="submit" className="btn-primary">
              {editingId ? "Update Movie" : "Create Movie"}
            </button>
          </form>
        </div>
      )}

      <div className="movies-list">
        {movies.length === 0 ? (
          <p>No movies found. Create one to get started.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Release Date</th>
                <th>Runtime</th>
                <th>Rating</th>
                <th>Current</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.title}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.release_date}</td>
                  <td>{movie.runtime_minutes} min</td>
                  <td>{movie.rating !== null && movie.rating !== undefined ? `${movie.rating}/5` : "N/A"}</td>
                  <td>{movie.is_current ? "✓" : "✗"}</td>
                  <td>
                    <button
                      className="btn-small btn-edit"
                      onClick={() => handleEdit(movie)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-small btn-delete"
                      onClick={() => handleDelete(movie.id)}
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
    </div>
  );
}

export default MovieManagement;
