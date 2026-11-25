import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const result = login(username.trim(), password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/app");
  }

  return (
    <div className="auth auth-login-page">
      <section className="auth-showcase">
        <Link to="/" className="auth-brand">
          <span className="auth-brand-mark">T</span>
          <span>TradeSim Pro</span>
        </Link>
        <p className="auth-kicker">VIRTUAL MARKET. REAL LEARNING.</p>
        <h1>Build your investing confidence.</h1>
        <p className="auth-showcase-copy">
          Explore the market, create a portfolio, and practice trading with
          virtual funds—without risking real money.
        </p>
        <div className="auth-benefits">
          <div>
            <strong>₹10 lakh</strong>
            <span>virtual starting balance</span>
          </div>
          <div>
            <strong>Learn by doing</strong>
            <span>track your portfolio and trades</span>
          </div>
          <div>
            <strong>Risk-free</strong>
            <span>prices and trades are simulated</span>
          </div>
        </div>
      </section>

      <form className="card auth-form login-form" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p className="login-description">Sign in to continue to your portfolio.</p>

        <label htmlFor="login-username">Username</label>
        <input
          id="login-username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="error-message">{error}</p>
        )}

        <button className="login-submit" type="submit">Login to your account</button>

        <div className="login-links">
          <p>New to TradeSim Pro? <Link to="/register">Create an account</Link></p>
          <p><Link to="/admin/login">Admin login</Link></p>
        </div>
        <p className="login-storage-note">
          Accounts are saved in this browser. If you registered elsewhere, create
          your account here first.
        </p>
      </form>
    </div>
  );
}