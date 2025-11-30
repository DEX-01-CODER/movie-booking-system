import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";
import "../styles/MovieCatalog.css";
import SearchBar from "../components/SearchBar";
import FilterButtons from "../components/FilterButtons";
import MovieList from "../components/MovieList";
import api from "../api";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";
import DetailsModal from "../components/DetailsModal";

const Catalog = () => {
    const [movies, setMovies] = useState([]);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
    api.get("/api/movies/")
      .then(res => setMovies(res.data))
      .catch(err => console.error(err));
    }, []);

     const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        navigate("/login", { replace: true });
    };

    const handleOpenModal = (type, movie) => {
    if (type === "DetailsModal") {
        setSelectedMovie(movie);
        setModalOpen(true);
    }
    };
    const handleCloseModal = () => setModalOpen(false);

    const filteredMovies = movies.filter((movie) => {
        const matchFilter = filter === "all" || (filter == "new" && movie.is_current) || (filter == "upcoming" && !movie.is_current);
        const matchSearch = movie.title.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    return (
    <div className="catalog-container">
      {/* ===== Top header bar ===== */}
      <header className="home-header">
        {/* Left: logo */}
        <div className="home-logo">MBS</div>

        {/* Center: nav tabs (Current / Upcoming / All) */}
        <nav className="home-nav">
          <FilterButtons filter={filter} setFilter={setFilter} />
        </nav>

        {/* Right: search + profile + logout */}
        <div className="home-right">
          <input
            type="text"
            className="home-search"
            placeholder="Search for movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link to="/profile" className="home-link-btn">
            Profile
          </Link>
          <button type="button" className="home-link-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ===== Main content ===== */}
      <main className="home-content">
        <section className="home-section">
          <h2 className="home-section-title">Movie Booking Site</h2>
          <MovieList movies={filteredMovies} onOpenModal={handleOpenModal} />
        </section>
      </main>

      {/* simple footer */}
      <footer className="home-footer">
        <p>Contact: info@mbs.com &nbsp; | &nbsp; © 2025 Movie Booking System</p>
      </footer>

      {modalOpen && (
        <DetailsModal
            isOpen={modalOpen}
            onClose={handleCloseModal}
            movie={selectedMovie}
        />
        )}
    </div>
  );

}

export default Catalog;