import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    const result = register({
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password
    });

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/app");
  }

  return (
    <div className="auth">
      <form className="card auth-form" onSubmit={handleSubmit}>

        {/* Virtual Trading Warning */}
        <div className="auth-warning">
          <span>⚠</span>
          <div>
            <strong>100% Virtual Trading</strong>
            <small>Demo platform · No real money involved</small>
          </div>
        </div>

        <h2>Create Account</h2>
        <p>Join TradeSim Pro and practice trading risk-free.</p>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Create Username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        {error && (
          <p className="error-message">{error}</p>
        )}

        <button type="submit">Create Account</button>

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>

      </form>
    </div>
  );
}