import { createContext, useState, useEffect, useMemo } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setToken(parsed.token);
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    setUser({ _id: data._id, username: data.username, email: data.email });
    setToken(data.token);
    localStorage.setItem(
      'auth',
      JSON.stringify({
        user: { _id: data._id, username: data.username, email: data.email },
        token: data.token
      })
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
  };

  const value = useMemo(
    () => ({ user, token, login, logout, loading, isAuthenticated: Boolean(user && token) }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
