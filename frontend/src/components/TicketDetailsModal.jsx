import React from "react"
import Modal from "./Modal"

export default function TicketDetailsModal({isOpen, onClose, order}) {
    if (!order || !order.movie) return null;

    const movie = order.movie
    const totalPrice = (order.ticket_price * order.tickets).toFixed(2)

    return (
        <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Ticket Details">
            <div className="detailsModal">
                <div className="modal-left">
                    <img
                        className="poster"
                        src={movie.poster_url}
                        alt={movie.title}
                    />
                </div>

                <div className="modal-right">
                    <h2 className="modal-title">
                        {movie.title}
                    </h2>
                    <p className="modal-meta">
                        {movie.rating ? 'Rating: ${movie.rating/5' : "Not Yet Rated"}
                    </p>
                    <p className="modal-desc">
                        {movie.description}
                    </p>
                    <hr style={{margin: "20px 0"}} />
                    <p>
                        <strong>
                            Tickets:
                        </strong> 
                        {order.tickets}
                    </p>
                    <div className="modal-actions">
                        <button className="secondary-btn" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}