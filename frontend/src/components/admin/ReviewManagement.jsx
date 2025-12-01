import React, { useState, useEffect } from "react";
import api from "../../api";
import "../../styles/Admin.css";

function ReviewManagement() {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

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

  const fetchReviews = async (movieId) => {
    try {
      const res = await api.get(`/api/reviews/?movie=${movieId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      alert("Error: " + (err.message || "Failed to fetch reviews"));
    }
  };

  const handleSelectMovie = (movieId) => {
    setSelectedMovieId(movieId);
    setReviews([]);
    if (movieId) {
      fetchReviews(movieId);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingReviewId(reviewId);
      await api.delete(`/api/reviews/${reviewId}/`);
      alert("Review deleted successfully");
      // Refresh reviews list
      if (selectedMovieId) {
        fetchReviews(selectedMovieId);
      }
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Error: " + (err.response?.data?.detail || err.message));
    } finally {
      setDeletingReviewId(null);
    }
  };

  const getMovieTitle = (movieId) => {
    const movie = movies.find(m => m.id === movieId);
    return movie ? movie.title : "Unknown Movie";
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating / 2), 0);
    return (sum / reviews.length).toFixed(1);
  };

  const convertRating = (rating) => {
    return (rating / 2).toFixed(1);
  };

  if (loading) return <div className="loading">Loading movies...</div>;

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Review Management</h2>
      </div>

      <div className="form-section">
        <h3>Select Movie to View Reviews</h3>
        <div className="form-group">
          <label>Movie *</label>
          <select
            value={selectedMovieId || ""}
            onChange={(e) => handleSelectMovie(e.target.value)}
          >
            <option value="">-- Select a Movie --</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedMovieId && (
        <div className="reviews-section">
          <h3>{getMovieTitle(selectedMovieId)}</h3>
          
          {reviews.length > 0 && (
            <div style={{
              backgroundColor: "#f8f9fa",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px"
            }}>
              <p style={{ margin: "5px 0" }}>
                <strong>Total Reviews:</strong> {reviews.length}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Average Rating:</strong> {calculateAverageRating()} / 5.0
              </p>
            </div>
          )}

          {reviews.length === 0 ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>No reviews yet for this movie.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Rating</th>
                    <th>Review Text</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id}>
                      <td>{review.username || "Anonymous"}</td>
                      <td>
                        <span style={{
                          display: "inline-block",
                          backgroundColor: review.rating >= 8 ? "#d4edda" : review.rating >= 6 ? "#fff3cd" : "#f8d7da",
                          color: review.rating >= 8 ? "#155724" : review.rating >= 6 ? "#856404" : "#721c24",
                          padding: "5px 10px",
                          borderRadius: "4px",
                          fontWeight: "bold"
                        }}>
                          {convertRating(review.rating)} / 5
                        </span>
                      </td>
                      <td style={{ maxWidth: "300px", wordWrap: "break-word" }}>
                        {review.comment || "No text provided"}
                      </td>
                      <td>
                        {new Date(review.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="btn-small btn-delete"
                          onClick={() => handleDeleteReview(review.id)}
                          disabled={deletingReviewId === review.id}
                        >
                          {deletingReviewId === review.id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReviewManagement;
