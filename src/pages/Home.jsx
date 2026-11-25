import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="home">
      <section className="home-hero">
        <h1>Practice the market without the risk</h1>
        <p>
          Build a portfolio, follow the market, and improve your trading strategy
          using virtual funds.
        </p>
        <div className="home-actions">
          <Link to="/register" className="home-button primary">Get Started</Link>
          <Link to="/login" className="home-button">Login</Link>
        </div>
        <div className="home-features" aria-label="TradeSim Pro features">
          <div className="home-feature">
            <span className="home-feature-icon" aria-hidden="true">$</span>
            <div>
              <h2>Virtual Portfolio</h2>
              <p>Start with 10 lakh in virtual funds.</p>
            </div>
          </div>
          <div className="home-feature">
            <span className="home-feature-icon" aria-hidden="true">↗</span>
            <div>
              <h2>Live Market</h2>
              <p>Explore stocks and follow the market.</p>
            </div>
          </div>
          <div className="home-feature">
            <span className="home-feature-icon" aria-hidden="true">◫</span>
            <div>
              <h2>Track Performance</h2>
              <p>Review trades and improve your strategy.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}