import { Link } from "react-router-dom";
import { getUser } from "../data/account";
import stocks from "../data/stocks";

export default function Dashboard() {
  const user = getUser();

  const investment = user.holdings.reduce(
    (total, item) => total + item.averagePrice * item.quantity, 0
  );

  const value = user.holdings.reduce((total, item) => {
    const stock = stocks.find(s => s.symbol === item.symbol);
    return total + (stock ? stock.price * item.quantity : 0);
  }, 0);

  const profit = value - investment;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">YOUR TRADING OVERVIEW</p>
          <h1>Good to see you, {user.name}</h1>
          <p className="dashboard-subtitle">
            Here’s how your virtual portfolio is doing today.
          </p>
        </div>
        <Link to="/app/market" className="dashboard-header-link">
          Browse market <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className="dashboard-stats" aria-label="Portfolio summary">
        <article className="dashboard-stat">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-icon balance-icon" aria-hidden="true">₹</span>
            <span className="dashboard-stat-label">Available balance</span>
          </div>
          <p className="dashboard-stat-value">₹{user.balance.toLocaleString("en-IN")}</p>
          <p className="dashboard-stat-note">Ready to invest</p>
        </article>

        <article className="dashboard-stat">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-icon investment-icon" aria-hidden="true">◫</span>
            <span className="dashboard-stat-label">Total invested</span>
          </div>
          <p className="dashboard-stat-value">₹{investment.toLocaleString("en-IN")}</p>
          <p className="dashboard-stat-note">Cost of your holdings</p>
        </article>

        <article className="dashboard-stat">
          <div className="dashboard-stat-top">
            <span className="dashboard-stat-icon value-icon" aria-hidden="true">▤</span>
            <span className="dashboard-stat-label">Portfolio value</span>
          </div>
          <p className="dashboard-stat-value">₹{value.toLocaleString("en-IN")}</p>
          <p className="dashboard-stat-note">Current value of holdings</p>
        </article>

        <article className="dashboard-stat">
          <div className="dashboard-stat-top">
            <span className={`dashboard-stat-icon ${profit >= 0 ? "profit-icon" : "loss-icon"}`} aria-hidden="true">
              {profit >= 0 ? "↗" : "↘"}
            </span>
            <span className="dashboard-stat-label">Overall profit / loss</span>
          </div>
          <p className={`dashboard-stat-value ${profit >= 0 ? "green" : "red"}`}>
            {profit > 0 ? "+" : ""}₹{profit.toLocaleString("en-IN")}
          </p>
          <p className="dashboard-stat-note">Since you started investing</p>
        </article>
      </section>

      <section className="dashboard-lower">
        <article className="dashboard-panel dashboard-actions">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-eyebrow">MAKE YOUR NEXT MOVE</p>
              <h2>Quick actions</h2>
            </div>
          </div>
          <div className="dashboard-action-list">
            <Link to="/app/market" className="dashboard-action">
              <span className="dashboard-action-icon" aria-hidden="true">↗</span>
              <span>
                <strong>Explore the market</strong>
                <small>Find your next opportunity</small>
              </span>
              <span className="dashboard-action-arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/app/portfolio" className="dashboard-action">
              <span className="dashboard-action-icon portfolio-action-icon" aria-hidden="true">◫</span>
              <span>
                <strong>View your portfolio</strong>
                <small>Check your holdings and returns</small>
              </span>
              <span className="dashboard-action-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </article>

        <article className="dashboard-panel dashboard-market">
          <div className="dashboard-panel-heading">
            <div>
              <p className="dashboard-eyebrow">MARKET SNAPSHOT</p>
              <h2>Popular stocks</h2>
            </div>
            <Link to="/app/market" className="dashboard-view-all">View all <span aria-hidden="true">→</span></Link>
          </div>
          <div className="dashboard-market-list">
            {stocks.slice(0, 5).map(stock => (
              <div className="dashboard-market-row" key={stock.symbol}>
                <div className="dashboard-market-symbol">
                  <span className="dashboard-market-avatar" aria-hidden="true">{stock.symbol.slice(0, 1)}</span>
                  <div>
                    <strong>{stock.symbol}</strong>
                    <small>{stock.sector}</small>
                  </div>
                </div>
                <span className="dashboard-market-price">₹{stock.price.toLocaleString("en-IN")}</span>
                <span className={`dashboard-market-change ${stock.change >= 0 ? "green" : "red"}`}>
                  {stock.change > 0 ? "+" : ""}{stock.change}%
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}