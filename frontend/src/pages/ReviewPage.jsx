import React, {useState} from "react"
import ReviewForm from "../components/ReviewForm"
import ReviewList from "../components/ReviewList"
import "../styles/Reviews.css"

export default function ReviewPage({movieId}) {
    const [review, setReviews] = useState([]);

    const addReview = (review) => {
        setReviews(prev => [...prev, 
            {
                id: Date.now(),
                movieId: movieId,
                ...review
            }
        ]);
    }

    const movieReviews = review.filter(r=>r.movieId === movieId);

    return (
        <div className="reviews-page">
            <h1>Reviews</h1>
            <ReviewForm addReview={addReview}/>
            <ReviewList reviews={movieReviews}/>
        </div>
    );
}