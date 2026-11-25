import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (
      username.trim() !== ADMIN_USERNAME ||
      password !== ADMIN_PASSWORD
    ) {
      setError("Invalid administrator username or password.");
      return;
    }

    localStorage.removeItem("currentUser");
    localStorage.setItem("currentAdmin", "true");
    navigate("/admin/users");
  }

  return (
    <div className="auth">
      <form className="card auth-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <p>Demo-only access. Accounts are stored in this browser.</p>

        <input
          type="text"
          placeholder="Admin username"
          value={username}
          onChange={event => setUsername(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Login as Admin</button>
        <p className="admin-credentials">
          Admin ID: <strong>{ADMIN_USERNAME}</strong>
          <br />
          Admin Password: <strong>{ADMIN_PASSWORD}</strong>
        </p>
        <p><Link to="/login">Back to user login</Link></p>
      </form>
    </div>
  );
}
