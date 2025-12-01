import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import api from "../api";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";

function ProtectedRoute({ children, isAdmin = false }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const refreshToken = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refresh) {
      // no refresh token stored -> force login
      setIsAuthorized(false);
      return;
    }

    try {
      const res = await api.post("/api/token/refresh/", { refresh });

      if (res.status === 200) {
        // store the new access token and mark user as authorized
        localStorage.setItem(ACCESS_TOKEN_KEY, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!token) {
      setIsAuthorized(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const tokenExpiration = decoded.exp; // seconds
      const now = Date.now() / 1000;       // seconds

      if (tokenExpiration < now) {
        // token expired -> try to refresh
        await refreshToken();
      } else {
        setIsAuthorized(true);
        
        // Check if admin route requires is_staff check
        if (isAdmin) {
          try {
            const userRes = await api.get("/api/user/me/");
            const staffStatus = userRes.data.is_staff || false;
            setIsAdminUser(staffStatus);
            if (!staffStatus) {
              console.warn("User is not admin");
            }
          } catch (err) {
            console.error("Error checking admin status:", err);
            setIsAdminUser(false);
          }
        } else {
          setIsAdminUser(true); // Not admin route, so allow
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsAuthorized(false);
    }
  };

  if (isAuthorized === null || (isAdmin && isAdminUser === null)) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && !isAdminUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
