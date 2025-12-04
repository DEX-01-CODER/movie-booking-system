import React from 'react'
import ReviewItem from './ReviewItem'


export default function ReviewList({reviews}) {
    return (
        <div>
            <h2 className="reviews-section-title">Reviews</h2>
            {reviews.length ===0 ?
            (<p>No Reviews Yet. Be the first to leave one!</p>)
            : (<ul>
                {reviews.map((review) => (
                    <ReviewItem key={review.id} review={review}/>
                ))}
            </ul>
        )}
        </div>
    );
}
