import React from 'react'

export default function ReviewItem({review}) {
    return (
        <li>
            <h3>
                {review.name}
            </h3>
            <p>
                Rating: {review.rating} stars
            </p>
            <p>
                {review.comment}
            </p>
        </li>
    );
}