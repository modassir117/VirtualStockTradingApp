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
      </section>
    </main>
  );
}