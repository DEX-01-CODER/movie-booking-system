import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/OrderHistory.css";

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = () => {
        api.get("/api/tickets/")
            .then((res) => {
                setOrders(res.data);
            })
            .catch((err) => alert("Error fetching orders: " + err));
    };

    const handleViewTicket = (order) => {
        navigate("/success", { 
            state: { 
                booking: order,
                movie: { title: order.show?.movie_title || "Movie" } 
            } 
        });
    };

    return (
        <div className="order-history-container">
            <div className="header-row">
                <h1 style={{cursor: "pointer"}} onClick={() => navigate("/")}>
                    Movie Booking System (MBS)
                </h1>
                <div className="header-right">
                    {/* Removed Search and Filter Inputs */}
                    <button className="btn-back" onClick={() => navigate("/")}>← Back to Home</button>
                    <div className="user-icon">👤 Profile</div>
                </div>
            </div>

            <h2>Order History</h2>

            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Movie Title</th>
                        <th>Date/Time</th>
                        <th>Quantity</th>
                        <th>Ticket ID</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.show?.movie_title || "Loading..."}</td>
                            <td>{order.show?.showtime ? new Date(order.show.showtime).toLocaleString() : "N/A"}</td>
                            <td>{order.ticket_seats?.length || 0}</td>
                            <td>MBS-TKT-{order.id}</td>
                            <td>
                                <button 
                                    className={`status-btn ${order.status}`}
                                    onClick={() => handleViewTicket(order)}
                                >
                                    {order.status === 'paid' ? 'View Ticket' : order.status}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{textAlign: "center"}}>No bookings found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default OrderHistory;