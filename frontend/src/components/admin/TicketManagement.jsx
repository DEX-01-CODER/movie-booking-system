import React, { useState, useEffect } from "react";
import api from "../../api";
import "../../styles/Admin.css";

function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/tickets/");
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTickets = () => {
    return tickets.filter((ticket) => {
      const matchesStatus = filter === "all" || ticket.status === filter;
      const matchesSearch =
        ticket.movie_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };

  if (loading) return <div className="loading">Loading tickets...</div>;

  const filteredTickets = getFilteredTickets();
  const totalRevenue = filteredTickets
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + parseFloat(t.total_price), 0);

  return (
    <div className="management-section">
      <div className="section-header">
        <h2>Ticket Management</h2>
        <div>Total Revenue: ${totalRevenue.toFixed(2)}</div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Tickets</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
            <option value="used">Used</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            placeholder="Search by movie or ticket ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="tickets-list">
        {filteredTickets.length === 0 ? (
          <p>No tickets found matching your criteria.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Movie</th>
                <th>User</th>
                <th>Seats</th>
                <th>Show Time</th>
                <th>Price</th>
                <th>Status</th>
                <th>Booked Date</th>
                <th>Refund Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className={`status-${ticket.status}`}>
                  <td style={{ fontSize: "0.85rem", fontFamily: "monospace" }}>
                    {ticket.id.slice(0, 8)}...
                  </td>
                  <td>{ticket.movie_title}</td>
                  <td>{ticket.user}</td>
                  <td>
                    {ticket.seats?.map((s) => s.seat_number).join(", ") || "N/A"}
                  </td>
                  <td>{new Date(ticket.show_time).toLocaleString()}</td>
                  <td>${ticket.total_price}</td>
                  <td>
                    <span
                      className={`status-badge status-${ticket.status}`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td>{new Date(ticket.booking_time).toLocaleString()}</td>
                  <td>
                    {ticket.refund_amount
                      ? `$${ticket.refund_amount}`
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="stats-section">
        <p>Total Tickets: {filteredTickets.length}</p>
        <p>Paid Tickets: {filteredTickets.filter(t => t.status === 'paid').length}</p>
        <p>Cancelled Tickets: {filteredTickets.filter(t => t.status === 'cancelled').length}</p>
        <p>Used Tickets: {filteredTickets.filter(t => t.status === 'used').length}</p>
      </div>
    </div>
  );
}

export default TicketManagement;
