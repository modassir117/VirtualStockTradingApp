import { useState } from "react";
import stocks from "../data/stocks";
import { getUser, saveUser } from "../data/account";

export default function Portfolio() {
  const [user, setUser] = useState(() => getUser());
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function openSellDialog(holding) {
    setSelectedHolding(holding);
    setQuantity("1");
    setError("");
    setMessage("");
  }

  function sellStock(event) {
    event.preventDefault();
    setError("");

    const shares = Number(quantity);
    if (!selectedHolding || !Number.isSafeInteger(shares) || shares <= 0 ||
        shares > selectedHolding.quantity) {
      setError("Enter a valid quantity within your available shares.");
      return;
    }

    const stock = stocks.find(s => s.symbol === selectedHolding.symbol);
    if (!stock) {
      setError("The current stock price is unavailable.");
      return;
    }

    const amount = stock.price * shares;

    const remaining = selectedHolding.quantity - shares;
    const updatedUser = {
      ...user,
      balance: user.balance + amount,
      holdings: remaining === 0
        ? user.holdings.filter(h => h.symbol !== selectedHolding.symbol)
        : user.holdings.map(h =>
            h.symbol === selectedHolding.symbol
              ? { ...h, quantity: remaining }
              : h
          ),
      transactions: [
        {
          type: "SELL",
          symbol: selectedHolding.symbol,
          quantity: shares,
          price: stock.price,
          date: new Date().toLocaleString(),
          timestamp: Date.now()
        },
        ...user.transactions
      ]
    };

    saveUser(updatedUser);
    setUser(updatedUser);
    setMessage(`Sold ${shares} ${selectedHolding.symbol} share${shares === 1 ? "" : "s"}.`);
    setSelectedHolding(null);
  }

  return (
    <div>
      <h1>My Portfolio</h1>
      {message && <p className="success-message" role="status">{message}</p>}
      <h3>Balance: ₹{user.balance.toLocaleString("en-IN")}</h3>

      {user.holdings.length === 0 ? (
        <p className="card">You have no shares yet. Visit the Market to buy stocks.</p>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Average Price</th>
                <th>Current Price</th>
                <th>Profit / Loss</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {user.holdings.map(item => {
                const stock = stocks.find(s => s.symbol === item.symbol);
                const profit = (stock.price - item.averagePrice) * item.quantity;

                return (
                  <tr key={item.symbol}>
                    <td>{item.symbol}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.averagePrice.toFixed(2)}</td>
                    <td>₹{stock.price}</td>
                    <td className={profit >= 0 ? "green" : "red"}>
                      ₹{profit.toFixed(2)}
                    </td>
                    <td>
                      <button onClick={() => openSellDialog(item)}>Sell</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedHolding && (
        <div className="trade-modal-backdrop">
          <section
            className="trade-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sell-dialog-title"
          >
            <h2 id="sell-dialog-title">Sell {selectedHolding.symbol}</h2>
            <p>Available shares: {selectedHolding.quantity}</p>
            <form onSubmit={sellStock}>
              <label htmlFor="sell-quantity">Quantity to sell</label>
              <input
                autoFocus
                id="sell-quantity"
                type="number"
                min="1"
                max={selectedHolding.quantity}
                step="1"
                value={quantity}
                onChange={event => setQuantity(event.target.value)}
                required
              />
              {error && <p className="error-message" role="alert">{error}</p>}
              <div className="trade-modal-actions">
                <button type="submit">Confirm Sell</button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setSelectedHolding(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}