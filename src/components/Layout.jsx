import { Link, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import TeamHelp from "./TeamHelp";

export default function Layout() {
  return (
    <>
      <Navbar />

      <div className="layout">
        <aside className="sidebar">
          <Link to="/app">Dashboard</Link>
          <Link to="/app/market">Market</Link>
          <Link to="/app/portfolio">Portfolio</Link>
          <Link to="/app/watchlist">Watchlist</Link>
          <Link to="/app/transactions">Transactions</Link>
          <Link to="/app/leaderboard">Leaderboard</Link>
          <Link to="/app/learning">Learning</Link>
          <TeamHelp />
        </aside>

        <main className="content">
          <Outlet />
        </main>
      </div>
    </>
  );
}