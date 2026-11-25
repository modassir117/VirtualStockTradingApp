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
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}!</p>

      <div className="grid">
        <div className="card">
          <p>Available Balance</p>
          <h2>₹{user.balance.toLocaleString("en-IN")}</h2>
        </div>

        <div className="card">
          <p>Investment</p>
          <h2>₹{investment.toLocaleString("en-IN")}</h2>
        </div>

        <div className="card">
          <p>Portfolio Value</p>
          <h2>₹{value.toLocaleString("en-IN")}</h2>
        </div>

        <div className="card">
          <p>Profit / Loss</p>
          <h2 className={profit >= 0 ? "green" : "red"}>
            ₹{profit.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <Link to="/app/market"><button>Explore Market</button></Link>
        <Link to="/app/portfolio"><button>My Portfolio</button></Link>
      </div>

      <div className="card">
        <h2>Market Overview</h2>
        {stocks.slice(0, 5).map(stock => (
          <p key={stock.symbol}>
            {stock.symbol} — ₹{stock.price}
          </p>
        ))}
      </div>
    </div>
  );
}