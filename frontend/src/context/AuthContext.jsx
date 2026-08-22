import { useEffect, useState } from "react";
import {
  loginUser,
  logoutUser,
  refreshToken,
} from "../services/authService";
import { getCurrentUser } from "../services/userService";

import AuthContext from "./AuthContextDefinition";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loadCurrentUser = async () => {
    const data = await getCurrentUser();

    setUser(data.user || null);
    setIsAuthenticated(true);

    return data.user;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      try {
        await loadCurrentUser();
      } catch {
        try {
          await refreshToken();
          await loadCurrentUser();
        } catch {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const data = await loginUser(credentials);

    setUser(data.user || null);
    setIsAuthenticated(true);

    return data;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshAuth = async () => {
    await refreshToken();
    return loadCurrentUser();
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshAuth,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;