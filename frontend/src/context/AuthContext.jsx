/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";
import { clearSession, getErrorMessage } from "../services/api";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("agritwin_user"));
  } catch {
    return null;
  }
}

function persistSession(session) {
  localStorage.setItem("agritwin_access_token", session.accessToken);
  localStorage.setItem("agritwin_refresh_token", session.refreshToken);
  localStorage.setItem("agritwin_user", JSON.stringify(session.user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const hasTokens =
        localStorage.getItem("agritwin_access_token") ||
        localStorage.getItem("agritwin_refresh_token");

      if (!hasTokens) {
        if (active) setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.me();
        if (active) setUser(currentUser);
      } catch (error) {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
          clearSession();
          if (active) setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = async (username, password) => {
    try {
      const session = await authService.login({ username, password });
      persistSession(session);
      setUser(session.user);
      return { success: true, user: session.user };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  const register = async (username, email, password) => {
    try {
      await authService.register({ username, email, password });
      return {
        success: true,
        message: "Registration successful! You can now login.",
      };
    } catch (error) {
      return { success: false, message: getErrorMessage(error) };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // The local session is cleared even if the server call fails.
    } finally {
      clearSession();
      setUser(null);
    }
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
        register,
        logout,
        isAdmin,
        isUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}