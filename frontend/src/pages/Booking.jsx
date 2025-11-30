import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Booking.css";

function Booking() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [theater, setTheater] = useState("Lubbock Grand Cinema");
    const [showtime, setShowtime] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/movies/")
            .then((res) => {
                const foundMovie = res.data.find(m => m.id.toString() === movieId);
                if (foundMovie) {
                    setMovie(foundMovie);
                } else {
                    alert("Movie not found");
                    navigate("/");
                }
            })
            .catch((err) => alert("Error loading movie: " + err))
            .finally(() => setLoading(false));
    }, [movieId, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!movie) return <div>Movie not found</div>;

    const pricePerTicket = movie.price_per_ticket || 12.50;
    const totalPrice = pricePerTicket * quantity;

    const handleProceed = () => {
        if (!showtime) {
            alert("Please select a showtime");
            return;
        }
        navigate("/payment", { 
            state: { 
                movie, 
                theater, 
                showtime, 
                quantity, 
                totalPrice 
            } 
        });
    };

    return (
        <div className="booking-container">
            {/* Header with Home Link */}
            <h1 className="page-header">
                <span onClick={() => navigate("/")} style={{cursor: "pointer"}} title="Go to Home">
                    Movie Booking System (MBS)
                </span> 
                <span className="profile-icon">👤 Profile</span>
            </h1>
            
            <div className="booking-content">
                <div className="booking-form">
                    <div className="form-group">
                        <label>Select Theater</label>
                        <select value={theater} onChange={(e) => setTheater(e.target.value)}>
                            <option value="Lubbock Grand Cinema">Lubbock</option>
                            <option value="Amarillo Star">Amarillo</option>
                            <option value="Levelland Loft">Levelland</option>
                            <option value="Plainview Palace">Plainview</option>
                            <option value="Snyder Cinema">Snyder</option>
                            <option value="Abilene Alley">Abilene</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Select Showtime</label>
                        <select value={showtime} onChange={(e) => setShowtime(e.target.value)}>
                            <option value="">Choose time...</option>
                            <option value="2025-10-26T10:00:00">10:00 AM</option>
                            <option value="2025-10-26T13:00:00">1:00 PM</option>
                            <option value="2025-10-26T19:00:00">7:00 PM</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Select Ticket Quantity (Max 10)</label>
                        <div className="quantity-selector">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <button 
                                    key={num} 
                                    className={quantity === num ? "qty-btn selected" : "qty-btn"}
                                    onClick={() => setQuantity(num)}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <h2>{movie.title}</h2>
                    <div className="summary-details">
                        <p>Date/Time: {showtime ? new Date(showtime).toLocaleString([], {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'}) : "Select a time"}</p>
                        <p>Price per Ticket: ${parseFloat(pricePerTicket).toFixed(2)}</p>
                    </div>
                    <div className="total-row">
                        <span>Total:</span>
                        <span className="total-price">${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="actions">
                <button className="btn-primary" onClick={handleProceed}>Proceed to Payment</button>
                
                {/* EXPLICIT HOME BUTTON via Cancel */}
                <button className="btn-secondary" onClick={() => navigate("/")}>Cancel & Go Home</button>
            </div>
        </div>
    );
}

export default Booking;