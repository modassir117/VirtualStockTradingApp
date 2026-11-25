import { Link, useNavigate } from "react-router-dom";
import {
  getRegisteredUsers,
  getUserPerformance
} from "../data/account";

export default function AdminLeaderboard() {
  const navigate = useNavigate();
  const accounts = getRegisteredUsers()
    .filter(user => user && typeof user === "object")
  const users = accounts.map(user => {
      const performance = getUserPerformance(user);
      return {
        userId: user.userId,
        name: user.name || user.username || "Trader",
        username: user.username || "—",
        balance: Number(user.balance) || 0,
        ...performance
      };
    });
  const ranking = [...users]
    .sort((a, b) => b.returnPercent - a.returnPercent);
  const recentActivity = accounts
    .flatMap(account => {
      return (Array.isArray(account.transactions) ? account.transactions : [])
        .filter(transaction => transaction && typeof transaction === "object")
        .map((transaction, index) => ({
          ...transaction,
          userId: account.userId,
          name: account.name,
          username: account.username,
          activityTime: Number(transaction.timestamp) ||
            Date.parse(transaction.date) || 0,
          rowKey: `${account.userId}-${transaction.timestamp || transaction.date}-${index}`
        }));
    })
    .sort((a, b) => b.activityTime - a.activityTime)
    .slice(0, 20);

  function logout() {
    localStorage.removeItem("currentAdmin");
    navigate("/login");
  }

  return (
    <>
      <nav className="navbar">
        <span className="logo">TradeSim Pro Admin</span>
        <div>
          <Link className="admin-nav-link" to="/admin/users">All Users</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <main className="content admin-content">
        <h1>Trader Insights</h1>
        <p>Review trader performance and recent buy/sell activity.</p>

        <section>
          <h2>Performance</h2>
          {ranking.length === 0 ? (
            <p className="card">No registered users to rank yet.</p>
          ) : (
            <div className="card admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Trader</th>
                    <th>Username</th>
                    <th>Account Value</th>
                    <th>Profit / Loss</th>
                    <th>Return</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((user, index) => (
                    <tr key={user.userId}>
                      <td>#{index + 1}</td>
                      <td>
                        <Link
                          className="admin-user-link"
                          to={`/admin/users/${encodeURIComponent(user.userId)}`}
                        >
                          {user.name}
                        </Link>
                      </td>
                      <td>{user.username}</td>
                      <td>₹{user.accountValue.toLocaleString("en-IN")}</td>
                      <td className={user.profitLoss >= 0 ? "green" : "red"}>
                        {user.profitLoss >= 0 ? "+" : "−"}₹{Math.abs(user.profitLoss).toLocaleString("en-IN")}
                      </td>
                      <td className={user.returnPercent >= 0 ? "green" : "red"}>
                        {user.returnPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="admin-activity-section">
          <h2>Recent Trading Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="card">No trades have been made yet.</p>
          ) : (
            <div className="card admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Trader</th>
                    <th>Action</th>
                    <th>Stock</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map(activity => (
                    <tr key={activity.rowKey}>
                      <td>
                        <Link
                          className="admin-user-link"
                          to={`/admin/users/${encodeURIComponent(activity.userId)}`}
                        >
                          {activity.name || activity.username || "Trader"}
                        </Link>
                      </td>
                      <td className={activity.type === "BUY" ? "green" : "red"}>
                        {activity.type}
                      </td>
                      <td>{activity.symbol}</td>
                      <td>{activity.quantity}</td>
                      <td>₹{Number(activity.price || 0).toLocaleString("en-IN")}</td>
                      <td>{activity.date || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
