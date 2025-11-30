import React, {useState} from "react"
import "../styles/Reviews.css"

export default function ReviewForm({addReview}) {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addReview({name, rating, comment});
        setName('');
        setRating(5);
        setComment('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Your Name" value={name} onChange={(e)=>setName(e.target.value)}/>
            <input type="number" min="1" max="5" value={rating} onChange={(e)=>setRating(e.target.value)}/>
            <textarea placeholder="Your Review" value={comment} onChange={(e)=>setComment(e.target.value)}></textarea>
            <button type="submit">
                Submit Review
            </button>
        </form>
    );
}