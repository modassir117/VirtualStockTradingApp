import { getUser } from "../data/account";

export default function Transactions() {
  const user = getUser();

  function downloadCSV() {
    const escapeCsv = value => {
      const text = String(value ?? "");
      const safeText = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
      return `"${safeText.replaceAll('"', '""')}"`;
    };
    const rows = [
      ["Type", "Stock", "Quantity", "Price", "Date"],
      ...user.transactions.map(t => [
        t.type, t.symbol, t.quantity, t.price, t.date
      ])
    ];

    const csv = rows.map(row => row.map(escapeCsv).join(",")).join("\n");
    const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);

    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <div>
      <h1>Transaction History</h1>

      <button onClick={downloadCSV} disabled={user.transactions.length === 0}>
        Download CSV
      </button>

      {user.transactions.length === 0 ? (
        <p className="card">No transactions yet.</p>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Stock</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {user.transactions.map((t, index) => (
                <tr key={index}>
                  <td className={t.type === "BUY" ? "green" : "red"}>
                    {t.type}
                  </td>
                  <td>{t.symbol}</td>
                  <td>{t.quantity}</td>
                  <td>₹{t.price}</td>
                  <td>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}