import { useState } from "react";
import stocks from "../data/stocks";
import StockCard from "../components/StockCard";
import { getUser, saveUser } from "../data/account";

export default function Market() {
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("All sectors");
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [balance, setBalance] = useState(() => getUser()?.balance ?? 0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function openBuyDialog(stock) {
    setSelectedStock(stock);
    setQuantity("1");
    setError("");
    setMessage("");
  }

  function buyStock(event) {
    event.preventDefault();
    setError("");

    const shares = Number(quantity);
    if (!Number.isSafeInteger(shares) || shares <= 0) {
      setError("Enter a valid whole-number quantity.");
      return;
    }

    const user = getUser();
    if (!user || !selectedStock) {
      setError("Your account could not be loaded. Please log in again.");
      return;
    }

    const cost = selectedStock.price * shares;

    if (cost > user.balance) {
      setError("Insufficient balance for this purchase.");
      return;
    }

    const holdings = [...user.holdings];
    const existing = holdings.find(h => h.symbol === selectedStock.symbol);

    if (existing) {
      const totalQuantity = existing.quantity + shares;
      existing.averagePrice =
        (existing.averagePrice * existing.quantity + cost) / totalQuantity;
      existing.quantity = totalQuantity;
    } else {
      holdings.push({
        symbol: selectedStock.symbol,
        quantity: shares,
        averagePrice: selectedStock.price
      });
    }

    user.balance -= cost;
    user.holdings = holdings;
    user.transactions.unshift({
      type: "BUY",
      symbol: selectedStock.symbol,
      quantity: shares,
      price: selectedStock.price,
      date: new Date().toLocaleString(),
      timestamp: Date.now()
    });

    saveUser(user);
    setBalance(user.balance);
    setMessage(`Bought ${shares} ${selectedStock.symbol} share${shares === 1 ? "" : "s"}.`);
    setSelectedStock(null);
  }

  function addWatchlist(stock) {
    const user = getUser();

    if (user.watchlist.includes(stock.symbol)) {
      setError("");
      setMessage(`${stock.symbol} is already in your watchlist.`);
      return;
    }

    user.watchlist.push(stock.symbol);
    saveUser(user);
    setError("");
    setMessage(`${stock.symbol} added to your watchlist.`);
  }

  const sectors = [...new Set(stocks.map(stock => stock.sector))].sort();
  const query = search.trim().toLowerCase();
  const filteredStocks = stocks.filter(stock =>
    (selectedSector === "All sectors" || stock.sector === selectedSector) &&
    (stock.name.toLowerCase().includes(query) ||
      stock.symbol.toLowerCase().includes(query))
  );

  return (
    <div>
      <h1>Stock Market</h1>
      <p className="market-balance">
        Available virtual cash: <strong>₹{balance.toLocaleString("en-IN")}</strong>
      </p>
      {message && <p className="success-message" role="status">{message}</p>}
      {error && <p className="error-message" role="alert">{error}</p>}
      <div className="market-filters">
        <input
          type="search"
          placeholder="Search by company or symbol..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          aria-label="Filter stocks by sector"
          value={selectedSector}
          onChange={event => setSelectedSector(event.target.value)}
        >
          <option>All sectors</option>
          {sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
      </div>
      <p className="stock-result-count">
        Showing {filteredStocks.length} of {stocks.length} stocks
      </p>

      {filteredStocks.length === 0 ? (
        <p className="card">No stocks match “{search}”. Try another search.</p>
      ) : (
        <div className="grid">
          {filteredStocks.map(stock => (
            <StockCard
              key={stock.symbol}
              stock={stock}
              onBuy={openBuyDialog}
              onWatch={addWatchlist}
            />
          ))}
        </div>
      )}

      {selectedStock && (
        <div className="trade-modal-backdrop">
          <section
            className="trade-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="buy-dialog-title"
          >
            <h2 id="buy-dialog-title">Buy {selectedStock.symbol}</h2>
            <p>Price per share: ₹{selectedStock.price.toLocaleString("en-IN")}</p>
            <form onSubmit={buyStock}>
              <label htmlFor="buy-quantity">Quantity</label>
              <input
                autoFocus
                id="buy-quantity"
                type="number"
                min="1"
                step="1"
                value={quantity}
                onChange={event => setQuantity(event.target.value)}
                required
              />
              {error && <p className="error-message" role="alert">{error}</p>}
              <div className="trade-modal-actions">
                <button type="submit">Confirm Buy</button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setSelectedStock(null)}
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