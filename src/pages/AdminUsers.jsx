import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAccountValue, getRegisteredUsers } from "../data/account";

export default function AdminUsers() {
  const navigate = useNavigate();
  const users = getRegisteredUsers();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("value");

  const matchingUsers = users.filter(user =>
    [user.userId, user.name, user.username]
      .some(value => value?.toLowerCase().includes(search.trim().toLowerCase()))
  );
  const filteredUsers = [...matchingUsers].sort((a, b) => {
    if (sortBy === "name") {
      return (a.name || a.username || "").localeCompare(
        b.name || b.username || ""
      );
    }

    if (sortBy === "username") {
      return (a.username || "").localeCompare(b.username || "");
    }

    return getAccountValue(b) - getAccountValue(a);
  });
  const totalBalance = users.reduce(
    (total, user) => total + (Number(user.balance) || 0),
    0
  );
  const combinedAccountValue = users.reduce(
    (total, user) => total + getAccountValue(user),
    0
  );

  function logout() {
    localStorage.removeItem("currentAdmin");
    navigate("/login");
  }

  function exportUsers() {
    const escapeCsv = value => {
      const text = String(value ?? "");
      const safeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
      return `"${safeText.replaceAll('"', '""')}"`;
    };
    const rows = [
      ["User ID", "Name", "Username", "Account Value"],
      ...filteredUsers.map(user => [
        user.userId,
        user.name,
        user.username,
        getAccountValue(user)
      ])
    ];
    const csv = rows.map(row => row.map(escapeCsv).join(",")).join("\n");
    const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "registered-users.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <>
      <nav className="navbar">
        <span className="logo">TradeSim Pro Admin</span>
        <div>
          <Link className="admin-nav-link" to="/admin/leaderboard">
            Leaderboard
          </Link>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <main className="content admin-content">
        <h1>Registered Users</h1>
        <p>Showing accounts saved in this browser only.</p>

        <div className="grid admin-summary">
          <section className="card">
            <p>Total Users</p>
            <h2>{users.length}</h2>
          </section>
          <section className="card">
            <p>Combined Virtual Balance</p>
            <h2>₹{totalBalance.toLocaleString("en-IN")}</h2>
          </section>
          <section className="card">
            <p>Combined Account Value</p>
            <h2>₹{combinedAccountValue.toLocaleString("en-IN")}</h2>
          </section>
        </div>

        <div className="admin-user-actions">
          <input
            className="admin-search"
            type="search"
            placeholder="Search by name, username, or ID"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          <select
            className="admin-sort"
            aria-label="Sort users"
            value={sortBy}
            onChange={event => setSortBy(event.target.value)}
          >
            <option value="value">Highest account value</option>
            <option value="name">Name A–Z</option>
            <option value="username">Username A–Z</option>
          </select>
          <button onClick={exportUsers} disabled={filteredUsers.length === 0}>
            Export CSV
          </button>
        </div>

        {users.length === 0 ? (
          <p className="card">No registered users yet.</p>
        ) : filteredUsers.length === 0 ? (
          <p className="card">No users match your search.</p>
        ) : (
          <div className="card admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Account Value</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.userId}>
                    <td>
                      <Link
                        className="admin-user-link"
                        to={`/admin/users/${encodeURIComponent(user.userId)}`}
                      >
                        {user.userId}
                      </Link>
                    </td>
                    <td>
                      <Link
                        className="admin-user-link"
                        to={`/admin/users/${encodeURIComponent(user.userId)}`}
                      >
                        {user.name}
                      </Link>
                    </td>
                    <td>{user.username}</td>
                    <td>₹{getAccountValue(user).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
