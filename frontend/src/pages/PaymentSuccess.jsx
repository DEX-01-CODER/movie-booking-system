import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import "../styles/PaymentSuccess.css";

function PaymentSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const ticketRef = useRef(); 
    const { booking, movie } = location.state || {};

    if (!booking) return <div className="error-msg">No booking details found. Please book a ticket first.</div>;

    const ticketData = `MBS-TICKET-${booking.id}-USER-${booking.user}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(ticketData)}`;

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        const element = ticketRef.current;
        const opt = {
            margin:       10,
            filename:     `MBS-Ticket-${booking.id}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true, 
                scrollY: 0,
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="success-container">
            {/* Header with Home Link */}
            <h1 className="page-header no-print">
                <span onClick={() => navigate("/")} style={{cursor: "pointer"}} title="Go to Home">
                    Movie Booking System (MBS)
                </span> 
                <span className="profile-icon">👤 Profile</span>
            </h1>

            <div className="success-header no-print">
                <div className="check-circle">✓</div>
                <h2>Payment Successful</h2>
            </div>

            <div className="ticket-card printable" ref={ticketRef}>
                <div className="ticket-left">
                    <div className="movie-poster-placeholder">
                        {movie?.poster_url ? (
                            <img src={movie.poster_url} alt={movie.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                        ) : (
                            <span>🎬</span>
                        )}
                    </div>
                </div>

                <div className="ticket-details-column">
                    <div className="ticket-info">
                        <h3>{movie?.title || "Movie Title"}</h3>
                        <p><strong>Theater:</strong> {booking.show?.theater_name || "Theater"}</p>
                        <p><strong>Showtime:</strong> {booking.show?.showtime ? new Date(booking.show.showtime).toLocaleString() : "N/A"}</p>
                        <p><strong>Seats:</strong> {booking.ticket_seats?.map(ts => ts.seat.seat_number).join(', ') || "N/A"}</p>
                        <p><strong>Total Price:</strong> ${booking.total_price || "0.00"}</p>
                        <p><strong>Ticket ID:</strong> MBS-TKT-{booking.id}</p>
                        <p><strong>Status:</strong> {booking.status}</p>
                    </div>
                    
                    <div className="ticket-qr">
                        <img 
                            src={qrUrl} 
                            alt={`QR Code for Ticket ${booking.id}`} 
                            crossOrigin="anonymous" 
                        />
                    </div>
                </div>
            </div>

            <div className="success-actions no-print">
                {/* Updated Buttons */}
                <button className="btn-primary" onClick={handleDownload}>Download Ticket (PDF)</button>
                <button className="btn-secondary" onClick={handlePrint}>Print Ticket</button>
                <a onClick={() => navigate("/my-orders")} className="link-text">Go to My Orders</a>
                
                <button className="btn-home-link" onClick={() => navigate("/")}>
                    Return to Home Page
                </button>
            </div>
        </div>
    );
}

export default PaymentSuccess;