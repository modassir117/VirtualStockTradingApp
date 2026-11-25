import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import stocks from "../data/stocks";
import { getRegisteredUsers, getUserPerformance } from "../data/account";

export default function AdminUserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState(() => getRegisteredUsers());
  const [fundsAmount, setFundsAmount] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const user = users.find(account => account.userId === userId);

  function logout() {
    localStorage.removeItem("currentAdmin");
    navigate("/login");
  }

  function addFunds(event) {
    event.preventDefault();
    setActionMessage("");
    setActionError("");

    const amount = Number(fundsAmount);
    if (!Number.isSafeInteger(amount) || amount <= 0) {
      setActionError("Enter a positive whole-number amount.");
      return;
    }

    const latestUsers = getRegisteredUsers();
    const targetUser = latestUsers.find(account => account.userId === userId);
    if (!targetUser) {
      setActionError("The balance could not be updated.");
      return;
    }

    const nextBalance = (Number(targetUser.balance) || 0) + amount;
    if (!Number.isSafeInteger(nextBalance)) {
      setActionError("The amount is too large to add.");
      return;
    }

    const updatedUsers = latestUsers.map(account =>
      account.userId === userId
        ? {
            ...account,
            balance: nextBalance,
            balanceHistory: [
              ...(account.balanceHistory ?? []),
              {
                type: "CREDIT",
                amount,
                date: new Date().toLocaleString()
              }
            ]
          }
        : account
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setFundsAmount("");
    setActionMessage(`₹${amount.toLocaleString("en-IN")} added to the balance.`);
  }

  function deleteUser() {
    if (!user || !window.confirm(
      `Permanently delete ${user.name}'s account, portfolio, and history?`
    )) {
      return;
    }

    const updatedUsers = getRegisteredUsers()
      .filter(account => account.userId !== userId);
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser?.userId === userId) {
      localStorage.removeItem("currentUser");
    }

    navigate("/admin/users");
  }

  const holdings = user?.holdings ?? [];
  const transactions = user?.transactions ?? [];
  const investment = holdings.reduce(
    (total, holding) =>
      total + (holding.averagePrice ?? 0) * (holding.quantity ?? 0),
    0
  );
  const portfolioValue = holdings.reduce((total, holding) => {
    const stock = stocks.find(item => item.symbol === holding.symbol);
    const price = stock?.price ?? holding.averagePrice ?? 0;
    return total + price * (holding.quantity ?? 0);
  }, 0);
  const profit = getUserPerformance(user).profitLoss;

  return (
    <>
      <nav className="navbar">
        <span className="logo">TradeSim Pro Admin</span>
        <div>
          <Link className="admin-nav-link" to="/admin/users">All Users</Link>
          <Link className="admin-nav-link" to="/admin/leaderboard">
            Leaderboard
          </Link>
          <button onClick={logout}>Logout</button>
        </div>
      </nav>

      <main className="content admin-content">
        {!user ? (
          <section className="card">
            <h1>User not found</h1>
            <Link to="/admin/users">Back to registered users</Link>
          </section>
        ) : (
          <>
            <h1>{user.name}</h1>
            <p>
              User ID: {user.userId} · Username: {user.username}
            </p>

            <div className="grid">
              <section className="card">
                <p>Available Balance</p>
                <h2>₹{(user.balance ?? 0).toLocaleString("en-IN")}</h2>
              </section>
              <section className="card">
                <p>Invested</p>
                <h2>₹{investment.toLocaleString("en-IN")}</h2>
              </section>
              <section className="card">
                <p>Portfolio Value</p>
                <h2>₹{portfolioValue.toLocaleString("en-IN")}</h2>
              </section>
              <section className="card">
                <p>Profit / Loss</p>
                <h2 className={profit >= 0 ? "green" : "red"}>
                  ₹{profit.toLocaleString("en-IN")}
                </h2>
              </section>
            </div>

            <section className="card admin-account-actions">
              <h2>Account Actions</h2>
              <form className="admin-funds-form" onSubmit={addFunds}>
                <label htmlFor="funds-amount">Add virtual funds (₹)</label>
                <input
                  id="funds-amount"
                  type="number"
                  min="1"
                  step="1"
                  value={fundsAmount}
                  onChange={event => setFundsAmount(event.target.value)}
                  required
                />
                <button type="submit">Add Funds</button>
              </form>
              {actionError && <p className="error-message">{actionError}</p>}
              {actionMessage && <p className="success-message">{actionMessage}</p>}
              <button className="danger-button" onClick={deleteUser}>
                Delete Account
              </button>
            </section>

            <section>
              <h2>Portfolio Holdings</h2>
              {holdings.length === 0 ? (
                <p className="card">This user has no holdings.</p>
              ) : (
                <div className="card admin-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Stock</th>
                        <th>Quantity</th>
                        <th>Average Price</th>
                        <th>Current Price</th>
                        <th>Market Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map(holding => {
                        const stock = stocks.find(
                          item => item.symbol === holding.symbol
                        );
                        const quantity = holding.quantity ?? 0;
                        const currentPrice =
                          stock?.price ?? holding.averagePrice ?? 0;

                        return (
                          <tr key={holding.symbol}>
                            <td>{holding.symbol}</td>
                            <td>{quantity}</td>
                            <td>₹{(holding.averagePrice ?? 0).toFixed(2)}</td>
                            <td>₹{currentPrice.toLocaleString("en-IN")}</td>
                            <td>
                              ₹{(currentPrice * quantity).toLocaleString("en-IN")}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section>
              <h2>Balance Adjustments</h2>
              {(user.balanceHistory ?? []).length === 0 ? (
                <p className="card">No balance adjustments yet.</p>
              ) : (
                <div className="card admin-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.balanceHistory.map((adjustment, index) => (
                        <tr key={`${adjustment.date}-${index}`}>
                          <td className="green">{adjustment.type}</td>
                          <td>₹{adjustment.amount.toLocaleString("en-IN")}</td>
                          <td>{adjustment.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section>
              <h2>Transaction History</h2>
              {transactions.length === 0 ? (
                <p className="card">This user has no transaction history.</p>
              ) : (
                <div className="card admin-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Stock</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction, index) => (
                        <tr key={`${transaction.date}-${index}`}>
                          <td
                            className={
                              transaction.type === "BUY" ? "green" : "red"
                            }
                          >
                            {transaction.type}
                          </td>
                          <td>{transaction.symbol}</td>
                          <td>{transaction.quantity}</td>
                          <td>₹{transaction.price}</td>
                          <td>{transaction.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
