import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Booking from "./pages/Booking"
import Payment from "./pages/Payment"
import PaymentSuccess from "./pages/PaymentSuccess"
import OrderHistory from "./pages/OrderHistory"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/book/:movieId" element={
            <ProtectedRoute>
                <Booking />
            </ProtectedRoute>
        }/>
        <Route path="/payment" element={
            <ProtectedRoute>
                <Payment />
            </ProtectedRoute>
        }/>
        <Route path="/success" element={
            <ProtectedRoute>
                <PaymentSuccess />
            </ProtectedRoute>
        }/>
        <Route path="/orders" element={
            <ProtectedRoute>
                <OrderHistory />
            </ProtectedRoute>
        }/>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App