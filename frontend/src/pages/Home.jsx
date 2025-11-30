// import react library
import React from "react";
// import Link + navigation helper
import { Link, useNavigate } from "react-router-dom";
// page styles
import "../styles/Home.css";
// token keys so we can clear them on logout
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";

// main home page component (shown after user logs in)
function Home() {
  const navigate = useNavigate();

  // handle logout: clear tokens + redirect to login
  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    navigate("/login", { replace: true });
  };

  return (
    <div className="home-page">
      {/* ===== Top header bar ===== */}
      <header className="home-header">
        {/* Left: logo */}
        <div className="home-logo">MBS</div>

        {/* Center: nav tabs (current / upcoming) */}
        <nav className="home-nav">
          <button className="home-nav-link home-nav-link--active">
            Current Movies
          </button>
          <button className="home-nav-link">Upcoming Movies</button>
        </nav>

        {/* Right: search + profile + logout */}
        <div className="home-right">
          <input
            type="text"
            className="home-search"
            placeholder="Search for movies..."
          />
          <Link to="/profile" className="home-link-btn">
            Profile
          </Link>
          <button
            type="button"
            className="home-link-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ===== Main content ===== */}
      <main className="home-content">
        <section className="home-section">
          <h2 className="home-section-title">Featured Movies</h2>

          <div className="home-movie-grid">
            {/* Card 1 */}
            <div className="movie-card">
              <img
                src="/posters/avatar-fire-and-ash.jpg"
                alt="Avatar: Fire and Ash"
                className="movie-poster"
              />
              <div className="movie-title">Avatar: Fire and Ash</div>
              <button className="home-card-button">View Details</button>
            </div>

            {/* Card 2 */}
            <div className="movie-card">
              <img
                src="/posters/wicked-for-good.jpg"
                alt="Wicked: For Good"
                className="movie-poster"
              />
              <div className="movie-title">Wicked: For Good</div>
              <button className="home-card-button">View Details</button>
            </div>

            {/* Card 3 */}
            <div className="movie-card">
              <img
                src="/posters/now-you-see-me.jpg"
                alt="Now You See Me: Now You Don't"
                className="movie-poster"
              />
              <div className="movie-title">
                Now You See Me: Now You Don't
              </div>
              <button className="home-card-button">View Details</button>
            </div>

            {/* Card 4 */}
            <div className="movie-card">
              <img
                src="/posters/running-man.jpg"
                alt="The Running Man"
                className="movie-poster"
              />
              <div className="movie-title">The Running Man</div>
              <button className="home-card-button">View Details</button>
            </div>

            {/* Card 5 */}
            <div className="movie-card">
              <img
                src="/posters/zootopia-2.jpg"
                alt="Zootopia 2"
                className="movie-poster"
              />
              <div className="movie-title">Zootopia 2</div>
              <button className="home-card-button">View Details</button>
            </div>

            {/* Card 6 */}
            <div className="movie-card">
              <img
                src="/posters/fnaf-2.jpg"
                alt="Five Nights at Freddy's 2"
                className="movie-poster"
              />
              <div className="movie-title">
                Five Nights at Freddy&apos;s 2
              </div>
              <button className="home-card-button">View Details</button>
            </div>

            {/* Card 7 */}
            <div className="movie-card">
              <img
                src="/posters/predator-badlands.jpg"
                alt="Predator: Badlands"
                className="movie-poster"
              />
              <div className="movie-title">Predator: Badlands</div>
              <button className="home-card-button">View Details</button>
            </div>

            {/* Card 8 */}
            <div className="movie-card">
              <img
                src="/posters/sisu-2.jpg"
                alt="Sisu: Road to Revenge"
                className="movie-poster"
              />
              <div className="movie-title">Sisu: Road to Revenge</div>
              <button className="home-card-button">View Details</button>
            </div>

            {/* Card 9 */}
            <div className="movie-card">
              <img
                src="/posters/eternity.jpg"
                alt="Eternity"
                className="movie-poster"
              />
              <div className="movie-title">Eternity</div>
              <button className="home-card-button">View Details</button>
            </div>

            {/* Card 10 */}
            <div className="movie-card">
              <img
                src="/posters/david.jpg"
                alt="David (Upcoming)"
                className="movie-poster"
              />
              <div className="movie-title">David (Upcoming)</div>
              <button className="home-card-button">View Details</button>
            </div>
          </div>
        </section>
      </main>

      {/* simple footer */}
      <footer className="home-footer">
        <p>Contact: info@mbs.com &nbsp; | &nbsp; © 2025 Movie Booking System</p>
      </footer>
    </div>
  );
}

export default Home;
