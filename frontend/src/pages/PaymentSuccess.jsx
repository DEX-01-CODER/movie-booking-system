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
                        🎬
                    </div>
                </div>

                <div className="ticket-details-column">
                    <div className="ticket-info">
                        <h3>{movie?.title || booking.movie_title}</h3>
                        <p><strong>Theater:</strong> {booking.theater_name}</p>
                        <p><strong>Showtime:</strong> {new Date(booking.show_time).toLocaleString()}</p>
                        <p><strong>Qty:</strong> {booking.quantity}</p>
                        <p><strong>Ticket ID:</strong> MBS-TKT-{booking.id}</p>
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
                <a onClick={() => navigate("/orders")} className="link-text">Go to Order History</a>
                
                <button className="btn-home-link" onClick={() => navigate("/")}>
                    Return to Home Page
                </button>
            </div>
        </div>
    );
}

export default PaymentSuccess;