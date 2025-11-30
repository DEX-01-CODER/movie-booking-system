// src/pages/MyOrders.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import api from "../api";
import "../styles/Form.css";
import "../styles/Modals.css";

function MyOrders() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    ticketId: null,
    ticketData: null
  });
  const [viewTicketModal, setViewTicketModal] = useState({
    isOpen: false,
    ticketData: null,
    movie: null
  });
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const ticketViewRef = useRef();

  useEffect(() => {
    fetchTickets();
  }, [navigate]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const ticketsRes = await api.get("/api/tickets/");
      setTickets(ticketsRes.data);
    } catch (err) {
      console.error("Error loading tickets:", err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

 
  const openCancelModal = (ticket) => {
    setCancelModal({
      isOpen: true,
      ticketId: ticket.id,
      ticketData: ticket
    });
    setCancellationReason("");
  };

  const closeCancelModal = () => {
    setCancelModal({ isOpen: false, ticketId: null, ticketData: null });
    setCancellationReason("");
  };



  const openViewTicketModal = (ticket) => {
    setViewTicketModal({
      isOpen: true,
      ticketData: ticket,
      movie: null
    });
  };

  const closeViewTicketModal = () => {
    setViewTicketModal({
      isOpen: false,
      ticketData: null,
      movie: null
    });
  };

    const handleDownloadTicket = () => {
    const element = ticketViewRef.current;
    const opt = {
      margin: 10,
      filename: `MBS-Ticket-${viewTicketModal.ticketData.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };  // ---------------------------
  // Submit cancellation
  // ---------------------------
  const submitCancellation = async () => {
    if (!cancelModal.ticketId) return;

    try {
      setCancelling(true);
      const response = await api.post(
        `/api/tickets/${cancelModal.ticketId}/cancel_ticket/`,
        { reason: cancellationReason }
      );

      // Show refund info
      alert(`Ticket cancelled successfully!\nRefund Amount: $${response.data.refund_amount} (${response.data.refund_percentage}% of original price)`);

      // Refresh tickets list
      await fetchTickets();
      closeCancelModal();
    } catch (err) {
      console.error("Error cancelling ticket:", err);
      const errorMsg = err.response?.data?.error || err.message || "Failed to cancel ticket";
      alert(`Error: ${errorMsg}`);
    } finally {
      setCancelling(false);
    }
  };

  // ---------------------------
  // Check if ticket can be cancelled
  // ---------------------------
  const canCancelTicket = (ticket) => {
    if (ticket.status !== 'paid') return false;
    
    const showTime = new Date(ticket.show_time);
    const now = new Date();
    const hoursDifference = (showTime - now) / (1000 * 60 * 60);
    
    // Can't cancel if less than 1 hour before show
    return hoursDifference >= 1;
  };

  if (loading) {
    return (
      <div className="form-page">
        <div className="form-card">
          <p style={{ textAlign: "center", color: "white" }}>
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-card profile-card">
        <h2 className="form-title">My Tickets & Orders</h2>
        <p className="form-subtitle">
          View all your bookings and ticket information
        </p>

        {/* ===== TICKETS/ORDERS SECTION ===== */}
        {tickets.length === 0 ? (
          <div style={{ textAlign: "center", color: "#666", padding: "40px 20px" }}>
            <p style={{ fontSize: "1.1rem", marginBottom: "20px" }}>
              No bookings yet.
            </p>
            <button
              type="button"
              className="form-button primary"
              onClick={() => navigate("/catalog")}
            >
              Book a Ticket Now
            </button>
          </div>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "20px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #007bff" }}>
                  <th style={{ padding: "10px", textAlign: "left" }}>Movie</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Seats</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Date & Time</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Price</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Status</th>
                  <th style={{ padding: "10px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} style={{ borderBottom: "1px solid #eee", padding: "10px" }}>
                    <td style={{ padding: "10px" }}>{ticket.movie_title || "N/A"}</td>
                    <td style={{ padding: "10px" }}>
                      {ticket.seats?.map(s => s.seat_number).join(', ') || "N/A"}
                    </td>
                    <td style={{ padding: "10px" }}>
                      {ticket.show_time ? new Date(ticket.show_time).toLocaleString() : "N/A"}
                    </td>
                    <td style={{ padding: "10px" }}>${ticket.total_price}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      <span style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        backgroundColor: ticket.status === 'paid' ? '#d4edda' : ticket.status === 'cancelled' ? '#f8d7da' : '#fff3cd',
                        color: ticket.status === 'paid' ? '#155724' : ticket.status === 'cancelled' ? '#721c24' : '#856404',
                        fontWeight: "bold",
                        fontSize: "0.9rem"
                      }}>
                        {ticket.status}
                      </span>
                    </td>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                        <button
                          type="button"
                          style={{
                            padding: "5px 12px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            fontWeight: "bold"
                          }}
                          onClick={() => openViewTicketModal(ticket)}
                        >
                          View Ticket
                        </button>
                        {canCancelTicket(ticket) && (
                          <button
                            type="button"
                            style={{
                              padding: "5px 12px",
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "0.9rem",
                              fontWeight: "bold"
                            }}
                            onClick={() => openCancelModal(ticket)}
                          >
                            Cancel Ticket
                          </button>
                        )}
                      </div>
                      {ticket.status === 'cancelled' && ticket.refund_amount && (
                        <span style={{ color: "#155724", fontWeight: "bold", fontSize: "0.9rem", marginTop: "5px", display: "block" }}>
                          Refunded: ${ticket.refund_amount}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== ACTION BUTTONS ===== */}
        <div style={{ marginTop: "30px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            type="button"
            className="form-link-button"
            onClick={() => navigate("/profile")}
          >
            Back to Profile
          </button>

          <button
            type="button"
            className="form-link-button"
            onClick={() => navigate("/catalog")}
          >
            Back to Catalog
          </button>
        </div>
      </div>


      {cancelModal.isOpen && cancelModal.ticketData && (
        <div className="modal-overlay" onClick={closeCancelModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={closeCancelModal}
              disabled={cancelling}
            >
              ×
            </button>

            <h2 style={{ marginBottom: "20px", color: "#333" }}>Cancel Ticket</h2>

            <div style={{ marginBottom: "20px", backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "4px" }}>
              <p style={{ margin: "5px 0", color: "#000", fontWeight: "500" }}>
                <strong>Movie:</strong> {cancelModal.ticketData.movie_title}
              </p>
              <p style={{ margin: "5px 0", color: "#000", fontWeight: "500" }}>
                <strong>Seats:</strong> {cancelModal.ticketData.seats?.map(s => s.seat_number).join(', ') || "N/A"}
              </p>
              <p style={{ margin: "5px 0", color: "#000", fontWeight: "500" }}>
                <strong>Show Time:</strong> {new Date(cancelModal.ticketData.show_time).toLocaleString()}
              </p>
              <p style={{ margin: "5px 0", color: "#000", fontWeight: "500" }}>
                <strong>Original Price:</strong> ${cancelModal.ticketData.total_price}
              </p>
            </div>

            <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "#e7f3ff", borderLeft: "4px solid #007bff", borderRadius: "4px" }}>
              <p style={{ margin: "0", color: "#004085", fontSize: "0.95rem" }}>
                <strong>Cancellation Policy:</strong><br/>
                • More than 24 hours before show: 100% refund<br/>
                • 6-24 hours before show: 75% refund<br/>
                • Less than 6 hours: 50% refund<br/>
                • Cannot cancel within 1 hour of show start
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
                Reason for Cancellation (Optional)
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Tell us why you're cancelling..."
                style={{
                  width: "100%",
                  minHeight: "80px",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  resize: "vertical"
                }}
                disabled={cancelling}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="form-button secondary"
                onClick={closeCancelModal}
                disabled={cancelling}
              >
                Keep Ticket
              </button>
              <button
                type="button"
                className="form-button primary"
                onClick={submitCancellation}
                disabled={cancelling}
                style={{
                  backgroundColor: "#dc3545",
                  opacity: cancelling ? 0.6 : 1,
                  cursor: cancelling ? "not-allowed" : "pointer"
                }}
              >
                {cancelling ? "Processing..." : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW TICKET MODAL*/}
      {viewTicketModal.isOpen && viewTicketModal.ticketData && (
        <div className="modal-overlay" onClick={closeViewTicketModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "700px", maxHeight: "90vh", overflowY: "auto" }}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={closeViewTicketModal}
            >
              ×
            </button>

            <div ref={ticketViewRef} style={{ padding: "20px", backgroundColor: "#fff" }}>
              <div style={{
                display: "flex",
                backgroundColor: "#1a1a2e",
                color: "white",
                padding: "20px",
                borderRadius: "8px 8px 0 0",
                textAlign: "center"
              }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: "0 0 10px 0" }}>🎬 Movie Ticket</h2>
                  <p style={{ margin: "0", fontSize: "0.9rem" }}>MBS - Movie Booking System</p>
                </div>
              </div>

              <div style={{
                display: "flex",
                backgroundColor: "#f8f9fa",
                borderBottom: "2px dashed #ccc"
              }}>
                {/* Movie Poster */}
                <div style={{
                  flex: "0 0 35%",
                  padding: "20px",
                  textAlign: "center",
                  backgroundColor: "#e0e0e0"
                }}>
                  <div style={{
                    width: "100%",
                    aspectRatio: "9/16",
                    backgroundColor: "#ccc",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    fontSize: "3rem"
                  }}>
                    🎬
                  </div>
                </div>

                {/* Ticket Details */}
                <div style={{
                  flex: "1",
                  padding: "20px",
                  backgroundColor: "#fff"
                }}>
                  <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>{viewTicketModal.ticketData.movie_title}</h3>
                  
                  <table style={{ width: "100%", marginBottom: "15px" }}>
                    <tbody>
                      <tr>
                        <td style={{ fontWeight: "bold", paddingBottom: "8px", width: "50%", color: "#000" }}>Theater:</td>
                        <td style={{ paddingBottom: "8px", color: "#000" }}>{viewTicketModal.ticketData.theater_name}</td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold", paddingBottom: "8px", color: "#000" }}>Date & Time:</td>
                        <td style={{ paddingBottom: "8px", color: "#000" }}>
                          {new Date(viewTicketModal.ticketData.show_time).toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold", paddingBottom: "8px", color: "#000" }}>Seats:</td>
                        <td style={{ paddingBottom: "8px", color: "#000" }}>
                          {viewTicketModal.ticketData.seats?.map(s => s.seat_number).join(', ') || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold", paddingBottom: "8px", color: "#000" }}>Total Price:</td>
                        <td style={{ paddingBottom: "8px", fontWeight: "bold", color: "#0056b3" }}>
                          ${viewTicketModal.ticketData.total_price}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold", paddingBottom: "8px", color: "#000" }}>Status:</td>
                        <td style={{ paddingBottom: "8px" }}>
                          <span style={{
                            padding: "3px 8px",
                            borderRadius: "3px",
                            backgroundColor: viewTicketModal.ticketData.status === 'paid' ? '#d4edda' : '#fff3cd',
                            color: viewTicketModal.ticketData.status === 'paid' ? '#155724' : '#856404',
                            fontWeight: "bold",
                            fontSize: "0.85rem"
                          }}>
                            {viewTicketModal.ticketData.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ fontWeight: "bold", paddingBottom: "8px", color: "#000" }}>Ticket ID:</td>
                        <td style={{ paddingBottom: "8px", fontSize: "0.85rem", wordBreak: "break-all", color: "#000" }}>
                          {viewTicketModal.ticketData.id}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* QR Code */}
                  <div style={{ textAlign: "center", marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #eee" }}>
                    <p style={{ fontSize: "0.85rem", color: "#000", margin: "0 0 10px 0", fontWeight: "500" }}>Scan to verify</p>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                        viewTicketModal.ticketData.ticket_qr || `MBS-TICKET-${viewTicketModal.ticketData.id}`
                      )}`}
                      alt="QR Code"
                      style={{ width: "120px", height: "120px" }}
                    />
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: "#f8f9fa",
                padding: "15px 20px",
                borderRadius: "0 0 8px 8px",
                fontSize: "0.85rem",
                color: "#000",
                textAlign: "center",
                borderTop: "1px solid #dee2e6",
                fontWeight: "500"
              }}>
                <p style={{ margin: "0" }}>Booking Date: {new Date(viewTicketModal.ticketData.booking_time).toLocaleString()}</p>
              </div>
            </div>

            <div style={{
              display: "flex",
              gap: "10px",
              justifyContent: "flex-end",
              padding: "20px",
              backgroundColor: "#f8f9fa",
              borderTop: "1px solid #dee2e6"
            }}>
              <button
                type="button"
                className="form-button secondary"
                onClick={closeViewTicketModal}
              >
                Close
              </button>
              <button
                type="button"
                className="form-button primary"
                onClick={handleDownloadTicket}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
