import { useCallback } from "react";

export default function MovieCard({ movie, onOpenModal }) {
  const handleBookTickets = useCallback(() => {
    if (movie.status === "upcoming") return;
    window.location.href = `/book/${movie.id}`;
  }, [movie]);

  return (
    <div className="movie-card">
      {/* Poster */}
      <img
        className="movie-poster"
        src={movie.poster_url}
        alt={movie.title}
      />

      {/* Title + rating */}
      <h3 className="movie-title">{movie.title}</h3>

      <p className="movie-rating">
        {movie.rating ? `Rating: ${movie.rating}/5` : "Not rated yet"}
      </p>

      {/* Actions */}
      <div className="movie-actions">
        {movie.status === "upcoming" ? (
          <button className="primary-btn primary-btn--disabled" disabled>
            Coming Soon
          </button>
        ) : (
          <button className="primary-btn" onClick={handleBookTickets}>
            Book Tickets
          </button>
        )}

        <button
          className="secondary-btn"
          onClick={() => onOpenModal("DetailsModal", movie)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
