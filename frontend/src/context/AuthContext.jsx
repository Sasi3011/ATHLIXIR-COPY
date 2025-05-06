"use client";

import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { initSocket } from "../api/socket";
import { checkProfileCompletion, requestPasswordReset, verifyResetToken, resetPassword } from "../api/auth.jsx";

const API_URL = `${import.meta.env.VITE_API_URL || 'https://athlixir-backend.onrender.com'}/auth`;

const AuthContext = createContext(null);

// Axios interceptor for JWT
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [resetRequestSent, setResetRequestSent] = useState(false);

  useEffect(() => {
    initSocket();
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);

      if (user.userType === "athlete") {
        checkProfileCompletion(user.email)
          .then((completed) => setProfileCompleted(completed))
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, userType) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password, userType });
      const { token, user } = response.data;
      setCurrentUser(user);
      setProfileCompleted(user.profileCompleted || false);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return { user, profileCompleted: user.profileCompleted };
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.error || "Authentication failed");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setProfileCompleted(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateProfileStatus = (status) => {
    setProfileCompleted(status);
  };

  const forgotPassword = async (email) => {
    try {
      const result = await requestPasswordReset(email);
      setResetRequestSent(true);
      return result;
    } catch (error) {
      console.error("Password reset request error:", error);
      throw error;
    }
  };

  const validateResetToken = async (email, token) => {
    try {
      return await verifyResetToken(email, token);
    } catch (error) {
      console.error("Token validation error:", error);
      throw error;
    }
  };

  const completePasswordReset = async (email, token, newPassword) => {
    try {
      const result = await resetPassword(email, token, newPassword);
      setResetRequestSent(false);
      return result;
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    profileCompleted,
    loading,
    resetRequestSent,
    login,
    logout,
    updateProfileStatus,
    forgotPassword,
    validateResetToken,
    completePasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};