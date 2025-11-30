import { Link } from "react-router-dom";

export default function MovieCard({ movie, onOpenModal }) {

    return (
        <div className="movie-card">
            <img className="poster" src={movie.poster_url} alt={movie.title} />

            <div className="movie-content">
                <h2>{movie.title}</h2>

                <p className="movie-description">
                    {movie.description || "No description available."}
                </p>

                <p className="movie-rating">
                    {movie.rating ? `Rating: ${movie.rating}/5` : "Not rated yet"}
                </p>

                <Link className="reviews-link" to={`/reviews/${movie.id}`}>
                    Read Reviews
                </Link>
            </div>

            <div className="movie-actions">
                <button className="primary-btn">
                    {movie.status === "upcoming" ? "Coming Soon" : "Book Tickets"}
                </button>

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