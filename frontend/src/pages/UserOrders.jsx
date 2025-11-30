import {useEffect, useState } from "react";
import TicketDetailsModal from "../components/TicketDetailsModal"
import "../styles/UserOrders.css"
import api from "../api"

export default function UserOrders() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        api.get("api/bookings/")
            .then(res => setOrders(res.data))
            .catch(err => console.error(err));
    })

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
            {orders.length ===0 ? (
                <p>No purchases yet.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div className="order-card" key={order.id}>
                            <img 
                                className="order-poster"
                                src={order.movie.poster_url}
                                alt={order.movie.title}
                            />

                            <div className="order-info">
                                <h2>{order.movie.title}</h2>
                                <p><strong>Tickets:</strong> {order.tickets}</p>
                                <p>
                                    <strong>Date:</strong> 
                                    {new Date(order.purchase_date).toLocaleDateString()}
                                </p>
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