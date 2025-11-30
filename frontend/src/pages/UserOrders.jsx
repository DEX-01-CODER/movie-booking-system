import {useEffect, useState } from "react";
import TicketDetailsModal from "../components/TicketDetailsModal"
import "../styles/UserOrders.css"
import api from "../api"

export default function UserOrders() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        api.get("/api/tickets/")
            .then(res => setOrders(res.data))
            .catch(err => console.error(err));
    }, []);

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <div className="orders-container">
            <h1>
                Ticket Orders
            </h1>
            {orders.length === 0 ? (
                <p>No purchases yet.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div className="order-card" key={order.id}>
                            <img 
                                className="order-poster"
                                src={order.show?.movie?.poster_url || order.show?.movie_poster}
                                alt={order.show?.movie_title || "Movie"}
                            />

                            <div className="order-info">
                                <h2>{order.show?.movie_title || "Movie"}</h2>
                                <p><strong>Seats:</strong> {order.ticket_seats?.map(ts => ts.seat.seat_number).join(', ') || "N/A"}</p>
                                <p>
                                    <strong>Date:</strong> 
                                    {order.show?.showtime ? new Date(order.show.showtime).toLocaleDateString() : "N/A"}
                                </p>
                                <p><strong>Price:</strong> ${order.total_price}</p>
                            </div>

                            <button 
                                className="status-btn"
                                onClick={() => openModal(order)}
                            >
                                {order.status}
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {selectedOrder && (<TicketDetailsModal isOpen={isModalOpen} onClose={closeModal} order={selectedOrder} />)}
        </div>
    );
}