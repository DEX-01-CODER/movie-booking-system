import React, { useState, useEffect } from "react";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { useParams } from "react-router-dom";
import api from "../api";
import "../styles/Reviews.css";

export default function ReviewPage() {
    const [previousReviews, setPreviousReviews] = useState([]);
    const { movieId } = useParams();
    const [movie, setMovie] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Fetch movie and reviews
    const fetchReviews = () => {
        api.get(`/api/reviews/?movie=${movieId}`)
            .then(res => setPreviousReviews(res.data))
            .catch(() => setPreviousReviews([]));
    };

    useEffect(() => {
        if (movieId) {
            api.get(`/api/movies/${movieId}/`)
                .then(res => setMovie(res.data))
                .catch(() => setMovie(null));
            fetchReviews();
        }
        // eslint-disable-next-line
    }, [movieId]);

    // Submit review to backend and refresh list
    const addReview = async (review) => {
        setSubmitting(true);
        try {
            await api.post('/api/reviews/', {
                movie: movieId,
                rating: Number(review.rating),
                comment: review.comment
            });
            fetchReviews();
        } catch (e) {
            if (e.response && e.response.data) {
                alert('Failed to submit review: ' + JSON.stringify(e.response.data));
                console.error('Review submission error:', e.response.data);
            } else {
                alert('Failed to submit review.');
                console.error('Review submission error:', e);
            }
        }
        setSubmitting(false);
    };

    return (
        <div className="reviews-page">
            {movie && (
                <div className="review-movie-header">
                    <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="review-movie-poster"
                        style={{ width: "120px", height: "180px", objectFit: "cover", borderRadius: "8px", marginRight: "20px" }}
                    />
                    <h1 style={{ margin: 0 }}>{movie.title}</h1>
                </div>
            )}
            <ReviewForm addReview={addReview} submitting={submitting} />
            <ReviewList reviews={previousReviews} />
        </div>
    );
}