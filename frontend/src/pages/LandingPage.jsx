import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import heroImage from '../assets/hero-movies.jpg';
import { ACCESS_TOKEN_KEY } from "../constants";
import api from '../api';
import SearchBar from "../components/SearchBar";

function LandingPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // redirect logged-in users to catalog
    if (localStorage.getItem(ACCESS_TOKEN_KEY)) {
      navigate("/catalog");
    }

    // fetch movies
    api.get('/api/movies/')
      .then(res => setMovies(res.data))
      .catch(err => console.error('Error fetching movies:', err));
  }, [navigate]);

  return (
    <div className="landing-page">

      {/* ==== HEADER ==== */}
      <header className="landing-header">
        <div className="header-content">
          <h1 className="logo">MBS</h1>

          {/* Search Bar */}
          <div className="search-container">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for movies..."
            />
          </div>

          {/* Login/Register */}
          <div className="auth-buttons">
            <Link to="/login"><button className="btn-login">Login</button></Link>
            <Link to="/register"><button className="btn-register">Register</button></Link>
          </div>
        </div>
      </header>

      {/* ==== HERO SECTION ==== */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h2 className="hero-title">Book Your Favorite <br /> Movies Instantly</h2>
            <p className="hero-subtitle">
              Explore the latest blockbusters and reserve your seats in seconds.
              Simple, fast, and secure.
            </p>

            <Link to="/login">
              <button className="btn-browse">Browse Movies</button>
            </Link>
          </div>

          <div className="hero-image">
            <img src={heroImage} alt="Cinema seats" />
          </div>
        </div>
      </section>

      {/* ==== FEATURED SECTION ==== */}
      <section className="featured-section">
        <div className="featured-header">
          <h3 className="section-title">Featured Movies</h3>
        </div>

        <div className="movies-grid">
          {movies
            .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(movie => (
              <div key={movie.id} className="movie-card">
                <img src={movie.poster_url} alt={movie.title} className="movie-poster" />

                <h4 className="movie-title">{movie.title}</h4>

                <Link to={`/book/${movie.id}`}>
                  <button className="btn-view-details">View Details</button>
                </Link>
              </div>
            ))}
        </div>

        {movies.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 &&
          searchQuery && (
            <p className="no-results">
              No movies found for "{searchQuery}". Try another search.
            </p>
          )}
      </section>

      {/* ==== FOOTER ==== */}
      <footer className="landing-footer">
        <p>© Movie Booking System 2025 | Contact Us | Terms of Service</p>
      </footer>
    </div>
  );
}

export default LandingPage;
