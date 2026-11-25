import { getAccountValue } from "../data/account";

export default function Leaderboard() {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const ranking = users
    .filter(user => user && typeof user === "object")
    .map(user => ({
      name: user.name || user.username || "Trader",
      balance: getAccountValue(user)
    }))
    .sort((a, b) => b.balance - a.balance);

  return (
    <div>
      <h1>Leaderboard</h1>
      <p className="card">Top traders based on account value.</p>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Trader</th>
              <th>Account Value</th>
            </tr>
          </thead>

          <tbody>
            {ranking.map((user, index) => (
              <tr key={index}>
                <td>#{index + 1}</td>
                <td>{user.name}</td>
                <td>₹{user.balance.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}