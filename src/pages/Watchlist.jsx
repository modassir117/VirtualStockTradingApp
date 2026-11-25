import { useState } from "react";
import stocks from "../data/stocks";
import { getUser, saveUser } from "../data/account";

export default function Watchlist() {
  const [user, setUser] = useState(() => getUser());
  const [message, setMessage] = useState("");

  const watchStocks = stocks.filter(stock =>
    user.watchlist.includes(stock.symbol)
  );

  function removeStock(symbol) {
    const updatedUser = {
      ...user,
      watchlist: user.watchlist.filter(item => item !== symbol)
    };
    saveUser(updatedUser);
    setUser(updatedUser);
    setMessage(`${symbol} removed from your watchlist.`);
  }

  return (
    <div>
      <h1>My Watchlist</h1>
      {message && <p className="success-message" role="status">{message}</p>}

      {watchStocks.length === 0 ? (
        <p className="card">Your watchlist is empty.</p>
      ) : (
        <div className="grid">
          {watchStocks.map(stock => (
            <div className="card" key={stock.symbol}>
              <h3>{stock.symbol}</h3>
              <p>{stock.name}</p>
              <h2>₹{stock.price}</h2>
              <button onClick={() => removeStock(stock.symbol)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}