export default function StockCard({ stock, onBuy, onWatch }) {
  return (
    <div className="card">
      <h3>{stock.symbol}</h3>
      <p>{stock.name}</p>
      <p className="stock-sector">{stock.sector}</p>
      <h2>₹{stock.price.toLocaleString("en-IN")}</h2>

      <button onClick={() => onBuy(stock)}>Buy</button>
      <button className="secondary" onClick={() => onWatch(stock)}>
        Watchlist
      </button>
    </div>
  );
}