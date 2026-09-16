import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import { useNotification } from "./NotificationContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();

  useEffect(() => {
    const active = authService.getCurrentUser();
    if (active) {
      setUser(active);
    }
    setLoading(false);
  }, []);

  const loginCandidate = async (email, password) => {
    try {
      const candidate = await authService.candidateLogin(email, password);
      setUser(candidate);
      showToast(`Welcome back, ${candidate.fullName}!`, "success");
      return candidate;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const loginAdmin = async (email, password) => {
    try {
      const admin = await authService.adminLogin(email, password);
      setUser(admin);
      showToast("Admin session authenticated successfully", "success");
      return admin;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const registerCandidate = async (candidateData) => {
    try {
      const created = await authService.registerCandidate(candidateData);
      setUser(created);
      showToast("Account created successfully! Welcome to CodeJudge.", "success");
      return created;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    showToast("Signed out successfully", "info");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isCandidate: user?.role === "candidate",
        loginCandidate,
        loginAdmin,
        registerCandidate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);