import { getUser } from "../data/account";

export default function Profile() {
  const user = getUser();
  const holdings = user.holdings ?? [];
  const transactions = user.transactions ?? [];
  const watchlist = user.watchlist ?? [];
  const totalShares = holdings.reduce(
    (total, holding) => total + holding.quantity,
    0
  );
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join("");

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <section className="card profile-header">
        <div className="profile-avatar" aria-hidden="true">
          {initials}
        </div>
        <div>
          <h2>{user.name}</h2>
          <p>TradeSim Pro member</p>
        </div>
      </section>

      <section className="card">
        <h2>Account Details</h2>
        <dl className="profile-details">
          <div>
            <dt>User ID</dt>
            <dd>{user.userId || "Not assigned"}</dd>
          </div>
          <div>
            <dt>Username</dt>
            <dd>{user.username}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user.email}</dd>
          </div>
        </dl>
      </section>

      <section className="grid profile-summary">
        <div className="card">
          <p>Available Virtual Balance</p>
          <h2>₹{(user.balance ?? 0).toLocaleString("en-IN")}</h2>
        </div>
        <div className="card">
          <p>Shares Held</p>
          <h2>{totalShares}</h2>
        </div>
        <div className="card">
          <p>Watchlist Stocks</p>
          <h2>{watchlist.length}</h2>
        </div>
        <div className="card">
          <p>Transactions</p>
          <h2>{transactions.length}</h2>
        </div>
      </section>
    </div>
  );
}
