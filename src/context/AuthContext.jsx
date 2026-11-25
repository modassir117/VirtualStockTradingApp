import { createContext, useContext, useState } from "react";
import {
  createUserId,
  getRegisteredUsers,
  STARTING_VIRTUAL_BALANCE
} from "../data/account";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  });

  function register(data) {
    const users = getRegisteredUsers();

    const exists = users.some(
      u =>
        typeof u?.username === "string" &&
        u.username.trim().toLowerCase() === data.username.toLowerCase()
    );

    if (exists) {
      return { success: false, message: "Username already exists!" };
    }

    const newUser = {
      ...data,
      userId: createUserId(),
      balance: STARTING_VIRTUAL_BALANCE,
      holdings: [],
      watchlist: [],
      transactions: []
    };

    users.push(newUser);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.removeItem("currentAdmin");
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setUser(newUser);

    return { success: true };
  }

  function login(username, password) {
    const users = getRegisteredUsers();

    const found = users.find(
      u =>
        typeof u?.username === "string" &&
        typeof u.password === "string" &&
        u.username.trim().toLowerCase() === username.toLowerCase() &&
        u.password === password
    );

    if (!found) {
      return { success: false, message: "Invalid username or password!" };
    }

    localStorage.removeItem("currentAdmin");
    localStorage.setItem("currentUser", JSON.stringify(found));
    setUser(found);

    return { success: true };
  }

  function logout() {
    localStorage.removeItem("currentUser");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook is exported alongside the provider because consumers share this auth context.
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);