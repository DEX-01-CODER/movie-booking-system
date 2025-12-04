import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    navigate("/login", { replace: true });
  };

  return (
    <div className="home-page">
      {/* ==== NAV BAR ==== */}
      <header className="home-header">
        <div className="home-logo">MBS</div>

        <nav className="home-nav">
          <button type="button" className="home-nav-link home-nav-link--active">
            Current Movies
          </button>
          <button type="button" className="home-nav-link">
            Upcoming Movies
          </button>
          <button type="button" className="home-nav-link">
            All Movies
          </button>
        </nav>

        <div className="home-right">
          <input
            type="text"
            className="home-search"
            placeholder="Search for movies..."
          />
          <Link to="/profile" className="home-link-btn">
            Account
          </Link>
          <button type="button" className="home-link-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ==== MAIN CONTENT ==== */}
      <main className="home-content">
        <section className="home-section">
          <h2 className="home-section-title">Featured Movies</h2>

          <div className="home-movie-grid">
            {/* You can replace these with dynamic API data later */}
            {[
              { img: "/posters/avatar-fire-and-ash.jpg", title: "Avatar: Fire and Ash" },
              { img: "/posters/wicked-for-good.jpg", title: "Wicked: For Good" },
              { img: "/posters/now-you-see-me.jpg", title: "Now You See Me: Now You Don't" },
              { img: "/posters/running-man.jpg", title: "The Running Man" },
              { img: "/posters/zootopia-2.jpg", title: "Zootopia 2" },
              { img: "/posters/fnaf-2.jpg", title: "Five Nights at Freddy's 2" },
              { img: "/posters/predator-badlands.jpg", title: "Predator: Badlands" },
              { img: "/posters/sisu-2.jpg", title: "Sisu: Road to Revenge" },
              { img: "/posters/eternity.jpg", title: "Eternity" },
              { img: "/posters/david.jpg", title: "David (Upcoming)" },
            ].map((movie) => (
              <div className="movie-card" key={movie.title}>
                <img src={movie.img} alt={movie.title} className="movie-poster" />
                <div className="movie-title">{movie.title}</div>
                <button type="button" className="home-card-button">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <p>Contact: info@mbs.com | © 2025 Movie Booking System</p>
      </footer>
    </div>
  );
}

export default Home;
