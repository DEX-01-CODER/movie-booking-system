
import { Link } from "react-router-dom";
import "../styles/Home.css";

function NotFound() {
  return (
    <div className="notfound-page">
      <div className="profile-card">
        <h2>404 - Page Not Found</h2>
        <p>The page you requested does not exist.</p>
        <Link to="/" className="small-btn primary">
          Go to Landing Page
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
