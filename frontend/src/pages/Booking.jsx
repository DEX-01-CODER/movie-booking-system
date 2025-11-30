import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Booking.css";

function Booking() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [theaters, setTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState("");
    const [shows, setShows] = useState([]);
    const [selectedShow, setSelectedShow] = useState("");
    const [availableSeats, setAvailableSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pricePerTicket, setPricePerTicket] = useState(0);

    useEffect(() => {
        // Fetch movie details
        api.get(`/api/movies/${movieId}/`)
            .then((res) => {
                setMovie(res.data);
            })
            .catch((err) => {
                alert("Error loading movie: " + err);
                navigate("/");
            })
            .finally(() => setLoading(false));
    }, [movieId, navigate]);

    useEffect(() => {
        // Fetch all theaters
        if (movie) {
            api.get("/api/theaters/")
                .then((res) => {
                    setTheaters(res.data);
                    if (res.data.length > 0) {
                        setSelectedTheater(res.data[0].id);
                    }
                })
                .catch((err) => console.error("Error loading theaters:", err));
        }
    }, [movie]);

    useEffect(() => {
        // Fetch shows for the selected movie and theater
        if (movie && selectedTheater) {
            api.get("/api/shows/", {
                params: {
                    movie: movieId,
                    theater: selectedTheater,
                },
            })
                .then((res) => {
                    setShows(res.data);
                    setSelectedShow("");
                    setAvailableSeats([]);
                    setSelectedSeats([]);
                })
                .catch((err) => console.error("Error loading shows:", err));
        }
    }, [movie, selectedTheater, movieId]);

    useEffect(() => {
        // When a show is selected, load its available seats
        if (selectedShow) {
            const show = shows.find(s => s.id === selectedShow);
            if (show) {
                // Filter for available seats (is_booked = false)
                const available = show.show_seats.filter(ss => !ss.is_booked);
                setAvailableSeats(available);
                setPricePerTicket(parseFloat(show.price));
                setSelectedSeats([]);
            }
        }
    }, [selectedShow, shows]);

    const toggleSeatSelection = (seatId) => {
        setSelectedSeats((prev) =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    };

    if (loading) return <div>Loading...</div>;
    if (!movie) return <div>Movie not found</div>;

    const totalPrice = pricePerTicket * selectedSeats.length;
    const quantity = selectedSeats.length;

    const handleProceed = () => {
        if (!selectedShow) {
            alert("Please select a show");
            return;
        }
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat");
            return;
        }
        
        const selectedShowData = shows.find(s => s.id === selectedShow);
        navigate("/payment", { 
            state: { 
                movie, 
                show: selectedShowData,
                selectedSeats, 
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
            </h1>
            
            <div className="booking-content">
                <div className="booking-form">
                    <h2>{movie.title}</h2>
                    
                    {/* Theater Selection */}
                    <div className="form-group">
                        <label>Select Theater</label>
                        <select 
                            value={selectedTheater} 
                            onChange={(e) => setSelectedTheater(e.target.value)}
                        >
                            <option value="">Choose theater...</option>
                            {theaters.map(theater => (
                                <option key={theater.id} value={theater.id}>
                                    {theater.name} - {theater.address}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Show Selection */}
                    {selectedTheater && shows.length > 0 ? (
                        <div className="form-group">
                            <label>Select Show</label>
                            <select 
                                value={selectedShow} 
                                onChange={(e) => setSelectedShow(e.target.value)}
                            >
                                <option value="">Choose show...</option>
                                {shows.map(show => (
                                    <option key={show.id} value={show.id}>
                                        {new Date(show.showtime).toLocaleString([], {
                                            year: 'numeric', 
                                            month: 'short', 
                                            day: 'numeric', 
                                            hour: '2-digit', 
                                            minute: '2-digit'
                                        })} - ${show.price}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : selectedTheater ? (
                        <p className="no-shows">No shows available for this theater</p>
                    ) : null}

                    {/* Seat Selection */}
                    {selectedShow && availableSeats.length > 0 ? (
                        <div className="form-group">
                            <label>Select Seats</label>
                            <div className="seats-grid">
                                {availableSeats.map(seatInfo => (
                                    <button
                                        key={seatInfo.id}
                                        className={`seat ${selectedSeats.includes(seatInfo.id) ? 'selected' : ''} ${seatInfo.seat_type}`}
                                        onClick={() => toggleSeatSelection(seatInfo.id)}
                                        type="button"
                                    >
                                        {seatInfo.seat_number}
                                    </button>
                                ))}
                            </div>
                            <p className="seat-legend">
                                <span>Seat Type: {availableSeats[0]?.seat_type === 'VIP' ? 'VIP' : 'Regular'}</span>
                            </p>
                        </div>
                    ) : selectedShow ? (
                        <p className="no-seats">All seats for this show are booked</p>
                    ) : null}
                </div>

                <div className="order-summary">
                    <h3>Order Summary</h3>
                    <h2>{movie.title}</h2>
                    <div className="summary-details">
                        {selectedShow && shows.find(s => s.id === selectedShow) && (
                            <>
                                <p>
                                    Show: {new Date(shows.find(s => s.id === selectedShow).showtime).toLocaleString([], {
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric', 
                                        hour: '2-digit', 
                                        minute: '2-digit'
                                    })}
                                </p>
                                <p>Theater: {theaters.find(t => t.id === selectedTheater)?.name}</p>
                            </>
                        )}
                        {selectedSeats.length > 0 && (
                            <p>Seats: {availableSeats
                                .filter(s => selectedSeats.includes(s.id))
                                .map(s => s.seat_number)
                                .join(', ')}
                            </p>
                        )}
                        <p>Price per Ticket: ${pricePerTicket.toFixed(2)}</p>
                    </div>
                    <div className="total-row">
                        <span>Tickets: {quantity}</span>
                    </div>
                    <div className="total-row">
                        <span>Total:</span>
                        <span className="total-price">${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="actions">
                <button 
                    className="btn-primary" 
                    onClick={handleProceed}
                    disabled={!selectedShow || selectedSeats.length === 0}
                >
                    Proceed to Payment
                </button>
                
                <button className="btn-secondary" onClick={() => navigate("/")}>Cancel & Go Home</button>
            </div>
        </div>
    );
}

export default Booking;