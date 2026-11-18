
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore logged-in user
  useEffect(() => {
    const savedUser = localStorage.getItem("agritwin_user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  // Login
  const login = (userData, token) => {
    localStorage.setItem("agritwin_user", JSON.stringify(userData));

    if (token) {
      localStorage.setItem("agritwin_token", token);
    }

    setUser(userData);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("agritwin_user");
    localStorage.removeItem("agritwin_token");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin,
        isUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
