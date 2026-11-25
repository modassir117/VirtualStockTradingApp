import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  function logout() {
    localStorage.removeItem("currentUser");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/app" className="logo">TradeSim Pro</Link>

      <div>
        <span>{user?.name}</span>
        <Link to="/app/profile" className="navbar-profile-link">Profile</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}