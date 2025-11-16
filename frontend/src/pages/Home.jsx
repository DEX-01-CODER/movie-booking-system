import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Home.css"

function Home() {
    const [movies, setMovies] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState("");
    const [seats, setSeats] = useState("");

    useEffect(() => {
        getMovies();
        getBookings();
    }, []);

    const getMovies = () => {
        api
            .get("/api/movies/")
            .then((res) => res.data)
            .then((data) => {
                setMovies(data);
                console.log("Movies:", data);
            })
            .catch((err) => alert(err));
    };

    const getBookings = () => {
        api
            .get("/api/bookings/")
            .then((res) => res.data)
            .then((data) => {
                setBookings(data);
                console.log("Bookings:", data);
            })
            .catch((err) => alert(err));
    };

    const createBooking = (e) => {
        e.preventDefault();
        api
            .post("/api/bookings/", { movie: selectedMovie, seats })
            .then((res) => {
                if (res.status === 201) alert("Booking created!");
                else alert("Failed to create booking.");
                getBookings();
            })
            .catch((err) => alert(err));
    };

    const deleteBooking = (id) => {
        api
            .delete(`/api/bookings/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Booking deleted!");
                else alert("Failed to delete booking.");
                getBookings();
            })
            .catch((err) => alert(err));
    };

    return (
        <div className="home-container">
            <h2>Available Movies</h2>
            <ul className="movie-list">
                {movies.map((movie) => (
                    <li key={movie.id} className="movie-item">
                        {movie.title} – {movie.release_date}
                    </li>
                ))}
            </ul>

            <h2>Your Bookings</h2>
            <ul className="booking-list">
                {bookings.map((booking) => (
                    <li key={booking.id} className="booking-item">
                        <span>
                            Movie ID: {booking.movie}, Seats: {booking.seats}
                        </span>
                        <button
                            className="delete-btn"
                            onClick={() => deleteBooking(booking.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <h2>Create Booking</h2>
            <form onSubmit={createBooking}>
                <label>Movie:</label>
                <select
                    value={selectedMovie}
                    onChange={(e) => setSelectedMovie(e.target.value)}
                    required
                >
                    <option value="">Select a movie</option>
                    {movies.map((movie) => (
                        <option key={movie.id} value={movie.id}>
                            {movie.title}
                        </option>
                    ))}
                </select>

                <label>Seats (e.g. A1,A2):</label>
                <input
                    type="text"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    required
                />

                <button type="submit">Book</button>
            </form>
        </div>
    );

}

export default Home;
