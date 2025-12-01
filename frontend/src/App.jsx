import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage.jsx";
import Profile from "./pages/Profile.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import Booking from "./pages/Booking.jsx";
import Payment from "./pages/Payment.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import Catalog from "./pages/Catalog.jsx";
import ReviewPage from "./pages/ReviewPage.jsx";
import UserOrders from "./pages/UserOrders.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Logout component clears local storage and redirects
function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

// Clear tokens before registering
function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />

        {/* Protected routes */}
        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <Catalog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review/:movieId"
          element={
            <ProtectedRoute>
              <ReviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-orders"
          element={
            <ProtectedRoute>
              <UserOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:movieId"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <PaymentSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;