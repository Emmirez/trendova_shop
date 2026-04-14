import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext.js';
import { authService, setTokens, clearTokens } from '../services/apiService';
import { ROLES } from './roles';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const initAuth = async () => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');

    if (stored && token) {
      setUser(JSON.parse(stored));
      try {
        const fresh = await authService.getMe();
        setUser(fresh.user);
        localStorage.setItem('user', JSON.stringify(fresh.user));
      } catch (err) {
        // Only clear tokens on 401 — not on server errors
        if (err.status === 401 || err.message?.includes('401')) {
          clearTokens();
          setUser(null);
        }
        // On 500 keep the stored user — backend issue not auth issue
      }
    }
    setLoading(false);
  };

  initAuth();
}, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    try {
      const data = await authService.login(credentials);
      setTokens(data.accessToken, data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    try {
      const data = await authService.register(userData);
      setTokens(data.accessToken, data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Logout locally even if backend fails
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const hasRole = useCallback((role) => {
    if (!user) return false;
    if (user.role === ROLES.SUPERADMIN) return true;
    return user.role === role;
  }, [user]);

  const hasAnyRole = useCallback((...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      updateUser,
      hasRole,
      hasAnyRole,
      ROLES,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
