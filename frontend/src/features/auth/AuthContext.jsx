import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

function getStoredAuth() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.user && parsed.token) return parsed;
    return null;
  } catch {
    localStorage.removeItem("auth");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setUser(stored.user);
    }
    setLoading(false);
  }, []);

  const login = useCallback((data) => {
    // data expected: { user, token, refreshToken }
    const authPayload = {
      user: data.user,
      token: data.token,
      refreshToken: data.refreshToken,
    };
    localStorage.setItem("auth", JSON.stringify(authPayload));
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
