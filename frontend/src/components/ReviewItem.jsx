import React from 'react'

export default function ReviewItem({review}) {
    // Format date if available
    let dateStr = "";
    if (review.created_at) {
        const date = new Date(review.created_at);
        dateStr = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    }
    return (
        <li>
            <div style={{display: 'flex', alignItems: 'center', gap: '1em'}}>
                <strong>{review.username || review.name || "Anonymous"}</strong>
                {dateStr && <span style={{color: '#888', fontSize: '0.9em'}}>({dateStr})</span>}
            </div>
            <p>
                Rating: {(review.rating / 2).toFixed(1)} / 5 stars
            </p>
            <p>
                {review.comment}
            </p>
        </li>
    );
}