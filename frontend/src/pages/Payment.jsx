import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/Payment.css";

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("credit_card");
    
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [venmoHandle, setVenmoHandle] = useState("");
    const [paypalEmail, setPaypalEmail] = useState("");
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location.state) {
            setBookingData(location.state);
        } else {
            navigate("/");
        }
    }, [location, navigate]);

    if (!bookingData) return null;

    const { movie, show, selectedSeats, quantity, totalPrice } = bookingData;

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (paymentMethod === "credit_card") {
            const cardRegex = /^\d{16}$/;
            if (!cardRegex.test(cardNumber.replace(/\s/g, ""))) {
                newErrors.cardNumber = "Card number must be 16 digits.";
                isValid = false;
            }
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryRegex.test(expiry)) {
                newErrors.expiry = "Use MM/YY format.";
                isValid = false;
            } else {
                const [expMonth, expYear] = expiry.split('/').map(num => parseInt(num, 10));
                const now = new Date();
                const currentYear = now.getFullYear() % 100; 
                const currentMonth = now.getMonth() + 1; 

                if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                    newErrors.expiry = "Card has expired.";
                    isValid = false;
                }
            }
            const cvvRegex = /^\d{3}$/;
            if (!cvvRegex.test(cvv)) {
                newErrors.cvv = "CVV must be 3 digits.";
                isValid = false;
            }
        }

        if (paymentMethod === "venmo") {
            const venmoRegex = /^@[A-Za-z0-9_-]{4,30}$/;
            if (!venmoRegex.test(venmoHandle)) {
                newErrors.venmo = "Handle must start with '@' (e.g., @john-doe).";
                isValid = false;
            }
        }

        if (paymentMethod === "paypal") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(paypalEmail)) {
                newErrors.paypal = "Enter a valid email address.";
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleConfirmPayment = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Create ticket with selected seats
            const res = await api.post("/api/tickets/", {
                show: show.id,
                total_price: totalPrice,
                seat_ids: selectedSeats  // Array of ShowSeat IDs
            });

            if (res.status === 201) {
                navigate("/success", { state: { booking: res.data, movie } });
            } else {
                alert("Payment failed. Please try again.");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("Error processing payment: " + (error.response?.data?.detail || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-container">
            <h1 className="page-header">
                <span onClick={() => navigate("/")} style={{cursor: "pointer"}}>
                    Movie Booking System (MBS)
                </span> 
                <span className="profile-icon">👤 Profile</span>
            </h1>
            
            <div className="payment-content">
                <h2>Payment</h2>
                <div className="payment-split">
                    <div className="booking-summary">
                        <h3>Booking Summary</h3>
                        <p><strong>Movie:</strong> {movie.title}</p>
                        <p><strong>Theater:</strong> {show.theater_name}</p>
                        <p><strong>Date/Time:</strong> {new Date(show.showtime).toLocaleString()}</p>
                        <p><strong>Seats:</strong> {show.show_seats
                            .filter(s => selectedSeats.includes(s.id))
                            .map(s => s.seat_number)
                            .join(', ')}</p>
                        <p><strong>Ticket Quantity:</strong> {quantity}</p>
                        <p className="total-amount"><strong>Total: ${totalPrice.toFixed(2)}</strong></p>
                    </div>

                    <div className="payment-form">
                        <h3>Payment Method</h3>
                        <div className="radio-group">
                            <label>
                                <input 
                                    type="radio" 
                                    value="credit_card" 
                                    checked={paymentMethod === "credit_card"} 
                                    onChange={(e) => { setPaymentMethod(e.target.value); setErrors({}); }} 
                                /> 
                                Credit Card
                            </label>
                            <label>
                                <input 
                                    type="radio" 
                                    value="venmo" 
                                    checked={paymentMethod === "venmo"} 
                                    onChange={(e) => { setPaymentMethod(e.target.value); setErrors({}); }} 
                                /> 
                                Venmo
                            </label>
                             <label>
                                <input 
                                    type="radio" 
                                    value="paypal" 
                                    checked={paymentMethod === "paypal"} 
                                    onChange={(e) => { setPaymentMethod(e.target.value); setErrors({}); }} 
                                /> 
                                PayPal
                            </label>
                        </div>

                        {paymentMethod === "credit_card" && (
                            <div className="method-inputs">
                                <input 
                                    type="text" 
                                    placeholder="Card Number (16 digits)" 
                                    className={`input-field card-icon ${errors.cardNumber ? "input-error" : ""}`}
                                    value={cardNumber}
                                    maxLength="16"
                                    onChange={(e) => setCardNumber(e.target.value)}
                                />
                                {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}

                                <div style={{display: 'flex', gap: '10px'}}>
                                    <div style={{flex: 1}}>
                                        <input 
                                            type="text" 
                                            placeholder="MM/YY" 
                                            className={`input-field ${errors.expiry ? "input-error" : ""}`}
                                            value={expiry}
                                            maxLength="5"
                                            onChange={(e) => setExpiry(e.target.value)}
                                        />
                                        {errors.expiry && <span className="error-text">{errors.expiry}</span>}
                                    </div>
                                    <div style={{flex: 1}}>
                                        <input 
                                            type="text" 
                                            placeholder="CVV" 
                                            className={`input-field ${errors.cvv ? "input-error" : ""}`}
                                            value={cvv}
                                            maxLength="3"
                                            onChange={(e) => setCvv(e.target.value)}
                                        />
                                        {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === "venmo" && (
                            <div className="method-inputs">
                                <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '8px'}}>Enter your Venmo details:</p>
                                <input 
                                    type="text" 
                                    placeholder="@username" 
                                    className={`input-field ${errors.venmo ? "input-error" : ""}`}
                                    value={venmoHandle}
                                    onChange={(e) => setVenmoHandle(e.target.value)}
                                />
                                {errors.venmo && <span className="error-text">{errors.venmo}</span>}
                            </div>
                        )}

                         {paymentMethod === "paypal" && (
                            <div className="method-inputs">
                                <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '8px'}}>Log in to PayPal:</p>
                                <input 
                                    type="email" 
                                    placeholder="PayPal Email" 
                                    className={`input-field ${errors.paypal ? "input-error" : ""}`}
                                    value={paypalEmail}
                                    onChange={(e) => setPaypalEmail(e.target.value)}
                                />
                                {errors.paypal && <span className="error-text">{errors.paypal}</span>}
                            </div>
                        )}

                        <div className="payment-actions">
                            {/* Updated Buttons to use Unified CSS Classes */}
                            <button className="btn-primary" onClick={handleConfirmPayment} disabled={loading}>
                                {loading ? "Processing..." : "Confirm Payment"}
                            </button>
                            <button className="btn-secondary" onClick={() => navigate(-1)}>
                                ← Back to Booking
                            </button>
                            <button className="btn-secondary" onClick={() => navigate("/")}>
                                Cancel & Go Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;