
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore logged-in user
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("agritwin_user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem("agritwin_user");
    }

    setLoading(false);
  }, []);

  // Register new demo account
  const register = (username, password, role) => {
    const accounts = JSON.parse(
      localStorage.getItem("agritwin_accounts") || "[]"
    );

    const exists = accounts.find(
      (account) => account.username === username
    );

    if (exists) {
      return {
        success: false,
        message: "Username already exists!",
      };
    }

    const newAccount = {
      username,
      password,
      role,
    };

    accounts.push(newAccount);

    localStorage.setItem(
      "agritwin_accounts",
      JSON.stringify(accounts)
    );

    return {
      success: true,
      message: "Registration successful!",
    };
  };

  // Login using username and password
  const login = (username, password) => {
    const accounts = JSON.parse(
      localStorage.getItem("agritwin_accounts") || "[]"
    );

    const account = accounts.find(
      (item) =>
        item.username === username &&
        item.password === password
    );

    if (!account) {
      return {
        success: false,
        message: "Invalid username or password!",
      };
    }

    const userData = {
      username: account.username,
      role: account.role,
    };

    localStorage.setItem(
      "agritwin_user",
      JSON.stringify(userData)
    );

    setUser(userData);

    return {
      success: true,
      user: userData,
    };
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("agritwin_user");
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
        register,
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

export const useAuth = () => useContext(AuthContext);
