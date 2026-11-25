import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import Transactions from "./pages/Transactions";
import Leaderboard from "./pages/Leaderboard";
import Learning from "./pages/Learning";
import Layout from "./components/Layout";
import AdminLogin from "./pages/AdminLogin";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";
import Profile from "./pages/Profile";
import AdminLeaderboard from "./pages/AdminLeaderboard";

function PrivateRoute({ children }) {
  return localStorage.getItem("currentUser")
    ? children
    : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  return localStorage.getItem("currentAdmin") === "true"
    ? children
    : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/users"
        element={<AdminRoute><AdminUsers /></AdminRoute>}
      />
      <Route
        path="/admin/users/:userId"
        element={<AdminRoute><AdminUserDetails /></AdminRoute>}
      />
      <Route
        path="/admin/leaderboard"
        element={<AdminRoute><AdminLeaderboard /></AdminRoute>}
      />

      <Route path="/app" element={
        <PrivateRoute><Layout /></PrivateRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="market" element={<Market />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="watchlist" element={<Watchlist />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="profile" element={<Profile />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="learning" element={<Learning />} />
      </Route>
    </Routes>
  );
}