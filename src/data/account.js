import stocks from "./stocks";

export const STARTING_VIRTUAL_BALANCE = 1_000_000;

export function createUserId() {
  const cryptoApi = globalThis.crypto;
  if (typeof cryptoApi?.randomUUID === "function") {
    return `USR-${cryptoApi.randomUUID()}`;
  }

  const bytes = new Uint8Array(16);
  if (typeof cryptoApi?.getRandomValues === "function") {
    cryptoApi.getRandomValues(bytes);
  } else {
    bytes.forEach((_, index) => {
      bytes[index] = Math.floor(Math.random() * 256);
    });
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  const uuid = [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20)
  ].join("-");

  return `USR-${uuid}`;
}

export function getRegisteredUsers() {
  const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
  let shouldSave = false;

  const users = storedUsers.map(user => {
    if (user.userId) {
      return user;
    }

    shouldSave = true;
    return { ...user, userId: createUserId() };
  });

  if (shouldSave) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  return users;
}

export function getAccountValue(user) {
  const holdings = Array.isArray(user?.holdings) ? user.holdings : [];
  const portfolioValue = holdings.reduce((total, holding) => {
    const stock = stocks.find(item => item.symbol === holding?.symbol);
    const currentPrice = Number(
      stock?.price ?? holding?.averagePrice
    ) || 0;
    return total + currentPrice * (Number(holding?.quantity) || 0);
  }, 0);

  return (Number(user?.balance) || 0) + portfolioValue;
}

export function getUserPerformance(user) {
  const addedFunds = (Array.isArray(user?.balanceHistory) ? user.balanceHistory : [])
    .filter(adjustment => adjustment.type === "CREDIT")
    .reduce((total, adjustment) => total + (Number(adjustment.amount) || 0), 0);
  const contributedCapital = STARTING_VIRTUAL_BALANCE + addedFunds;
  const accountValue = getAccountValue(user);
  const profitLoss = accountValue - contributedCapital;

  return {
    accountValue,
    contributedCapital,
    profitLoss,
    returnPercent: contributedCapital > 0
      ? (profitLoss / contributedCapital) * 100
      : 0
  };
}

export function getUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}

export function saveUser(updatedUser) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const updatedUsers = users.map(user =>
    user.email === updatedUser.email ? updatedUser : user
  );

  localStorage.setItem("users", JSON.stringify(updatedUsers));
  localStorage.setItem("currentUser", JSON.stringify(updatedUser));
}