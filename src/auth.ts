// Minimal client-side auth: username / password stored in localStorage.
// Not for production security — this is a local prototype.
import { useEffect, useState } from "react";

const KEY = "sms:auth";
const USERS_KEY = "sms:users";

export interface User {
  username: string;
  role: "admin" | "teacher" | "accountant";
  name: string;
}

interface StoredUser extends User {
  password: string;
}

function seedUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) return;
  const defaults: StoredUser[] = [
    { username: "admin",      password: "admin",      role: "admin",      name: "Administrator" },
    { username: "teacher",    password: "teacher",    role: "teacher",    name: "Head Teacher" },
    { username: "accountant", password: "accountant", role: "accountant", name: "Accountant" },
  ];
  localStorage.setItem(USERS_KEY, JSON.stringify(defaults));
}

export function useAuth() {
  seedUsers();
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; }
  });

  useEffect(() => {
    const h = () => {
      try { setUser(JSON.parse(localStorage.getItem(KEY) || "null")); } catch { setUser(null); }
    };
    window.addEventListener("sms-auth", h);
    return () => window.removeEventListener("sms-auth", h);
  }, []);

  const login = (username: string, password: string): string | null => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const match = users.find((u) => u.username === username && u.password === password);
    if (!match) {
      const log = JSON.parse(localStorage.getItem("sms:illegalLogins") || "[]");
      log.push({ username, time: new Date().toISOString(), reason: "Invalid credentials" });
      localStorage.setItem("sms:illegalLogins", JSON.stringify(log));
      return "Invalid username or password.";
    }
    const u: User = { username: match.username, role: match.role, name: match.name };
    localStorage.setItem(KEY, JSON.stringify(u));
    window.dispatchEvent(new Event("sms-auth"));
    setUser(u);
    return null;
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event("sms-auth"));
    setUser(null);
  };

  return { user, login, logout };
}
