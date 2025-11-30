import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import heroImage from '../assets/hero-movies.jpg';
import { ACCESS_TOKEN_KEY } from "../constants";
import api from '../api';

function LandingPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // redirect logged-in users to catalog
    if(localStorage.getItem(ACCESS_TOKEN_KEY)) {
      navigate("/catalog");
    }

    // fetch current movies from backend using axios instance
    api.get('/api/movies/')
      .then(res => setMovies(res.data))
      .catch(err => console.error('Error fetching movies:', err));
  }, [navigate]);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="header-content">
          <h1 className="logo">MBS</h1>
          <nav className="main-nav">
            <Link to="/current-movies" className="nav-link">Current Movies</Link>
            <Link to="/upcoming-movies" className="nav-link">Upcoming Movies</Link>
            <Link to="/search" className="nav-link">Search</Link>
          </nav>
          <div className="auth-buttons">
            <Link to="/login"><button className="btn-login" type="button">Login</button></Link>
            <Link to="/register"><button className="btn-register" type="button">Register</button></Link>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h2 className="hero-title">Book Your Favorite <br /> Movies Instantly</h2>
            <p className="hero-subtitle">
              Explore the latest blockbusters and reserve your seats in seconds. Simple, fast, and secure.
            </p>
            <Link to="/current-movies">
              <button className="btn-browse" type="button">Browse Movies</button>
            </Link>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Cinema seats with projector" />
          </div>
        </div>
      </section>

      <section className="featured-section">
        <h3 className="section-title">Featured</h3>
        <div className="movies-grid">
          {movies.map(movie => (
            <div key={movie.id} className="movie-card">
              <img src={movie.poster_url} alt={movie.title} className="movie-poster" />
              <h4 className="movie-title">{movie.title}</h4>
              <Link to={`/book/${movie.id}`}>
                <button className="btn-view-details" type="button">View Details</button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <p>© Movie Booking System 2025 | Contact Us | Terms of Service</p>
      </footer>
    </div>
  );
}

export default LandingPage;




// // import react library
// import React, { useEffect } from 'react';
// // import link for navigation
// import { Link, useNavigate } from 'react-router-dom';
// // import styling
// import '../styles/LandingPage.css';
// import heroImage from '../assets/hero-movies.jpg';
// import { ACCESS_TOKEN_KEY} from "../constants";

// // landing page component (shown before user logs in)
// function LandingPage() {
//   const navigate = useNavigate();
//   useEffect(() => {
//     if(localStorage.getItem(ACCESS_TOKEN_KEY)) {
//       navigate("/catalog");
//     }
//   }, [navigate]);

//   return (
//     // main container for entire landing page
//     <div className="landing-page">
//       {/* top navigation header */}
//       <header className="landing-header">
//         <div className="header-content">
//           {/* mbs logo */}
//           <h1 className="logo">MBS</h1>

//           {/* main navigation links */}
//           <nav className="main-nav">
//             {/* these links won't work until you're logged in - placeholder for now */}
//             <Link to="/current-movies" className="nav-link">
//               Current Movies
//             </Link>
//             <Link to="/upcoming-movies" className="nav-link">
//               Upcoming Movies
//             </Link>
//             <Link to="/search" className="nav-link">
//               Search
//             </Link>
//           </nav>

//           {/* login and register buttons */}
//           <div className="auth-buttons">
//             {/* takes user to login page */}
//             <Link to="/login">
//               <button className="btn-login" type="button">
//                 Login
//               </button>
//             </Link>
//             {/* takes user to registration page */}
//             <Link to="/register">
//               <button className="btn-register" type="button">
//                 Register
//               </button>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* hero banner with main call-to-action */}
//       <section className="hero-section">
//         <div className="hero-content">
//           <div className="hero-text">
//             <h2 className="hero-title">
//               Book Your Favorite <br /> Movies Instantly
//             </h2>
//             <p className="hero-subtitle">
//               Explore the latest blockbusters and reserve your seats in
//               seconds. Simple, fast, and secure.
//             </p>

//             {/* browse button now routes to current movies */}
//             <Link to="/current-movies">
//               <button className="btn-browse" type="button">
//                 Browse Movies
//               </button>
//             </Link>
//           </div>

//           <div className="hero-image">
//             <img src={heroImage} alt="Cinema seats with projector" />
//           </div>
//         </div>
//       </section>

//       {/* featured movies section */}
//       <section className="featured-section">
//         <h3 className="section-title">Featured</h3>

//         {/* grid of movie cards */}
//         <div className="movies-grid">
//           {/* movie card 1 */}
//           <div className="movie-card">
//             <img
//               src="/posters/avatar-fire-and-ash.jpg"
//               alt="Avatar: Fire and Ash"
//               className="movie-poster"
//             />
//             <h4 className="movie-title">Avatar: Fire and Ash</h4>
//             <button className="btn-view-details" type="button">
//               View Details
//             </button>
//           </div>

//           {/* movie card 2 */}
//           <div className="movie-card">
//             <img
//               src="/posters/wicked-for-good.jpg"
//               alt="Wicked: For Good"
//               className="movie-poster"
//             />
//             <h4 className="movie-title">Wicked: For Good</h4>
//             <button className="btn-view-details" type="button">
//               View Details
//             </button>
//           </div>

//           {/* movie card 3 */}
//           <div className="movie-card">
//             <img
//               src="/posters/now-you-see-me.jpg"
//               alt="Now You See Me: Now You Don't"
//               className="movie-poster"
//             />
//             <h4 className="movie-title">
//               Now You See Me: Now You Don't
//             </h4>
//             <button className="btn-view-details" type="button">
//               View Details
//             </button>
//           </div>

//           {/* movie card 4 */}
//           <div className="movie-card">
//             <img
//               src="/posters/running-man.jpg"
//               alt="The Running Man"
//               className="movie-poster"
//             />
//             <h4 className="movie-title">The Running Man</h4>
//             <button className="btn-view-details" type="button">
//               View Details
//             </button>
//           </div>

//           {/* movie card 5 */}
//           <div className="movie-card">
//             <img
//               src="/posters/zootopia-2.jpg"
//               alt="Zootopia 2"
//               className="movie-poster"
//             />
//             <h4 className="movie-title">Zootopia 2</h4>
//             <button className="btn-view-details" type="button">
//               View Details
//             </button>
//           </div>

//           {/* movie card 6 */}
//           <div className="movie-card">
//             <img
//               src="/posters/fnaf-2.jpg"
//               alt="Five Nights at Freddy's 2"
//               className="movie-poster"
//             />
//             <h4 className="movie-title">Five Nights at Freddy's 2</h4>
//             <button className="btn-view-details" type="button">
//               View Details
//             </button>
//           </div>

//           {/* movie card 7 */}
//           <div className="movie-card">
//             <img
//               src="/posters/predator-badlands.jpg"
//               alt="Predator: Badlands"
//               className="movie-poster"
//             />
//             <h4 className="movie-title">Predator: Badlands</h4>
//             <button className="btn-view-details" type="button">
//               View Details
//             </button>
//           </div>

//           {/* movie card 8 */}
//           <div className="movie-card">
//             <img
//               src="/posters/sisu-2.jpg"
//               alt="Sisu: Road to Revenge"
//               className="movie-poster"
//             />
//             <h4 className="movie-title">Sisu: Road to Revenge</h4>
//             <button className="btn-view-details" type="button">
//               View Details
//             </button>
//           </div>

//           {/* movie card 9 */}
//           <div className="movie-card">
//             <img
//               src="/posters/eternity.jpg"
//               alt="Eternity"
//               className="movie-poster"
//             />
//             <h4 className="movie-title">Eternity</h4>
//             <button className="btn-view-details" type="button">
//               View Details
//             </button>
//           </div>

//           {/* movie card 10 - upcoming movie */}
//           <div className="movie-card">
//             <img
//               src="/posters/david.jpg"
//               alt="David (Upcoming)"
//               className="movie-poster"
//             />
//             <h4 className="movie-title">David (Upcoming)</h4>
//             <button className="btn-view-details" type="button">
//               View Details
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* footer at bottom of page */}
//       <footer className="landing-footer">
//         <p>© Movie Booking System 2025 | Contact Us | Terms of Service</p>
//       </footer>
//     </div>
//   );
// }

// // export so it can be imported in app.jsx
// export default LandingPage;
