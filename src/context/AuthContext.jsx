// context/AuthContext.jsx
"use client";

import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import configureAxios from "../api/axiosConfig";
import { initSocket } from "../api/socket";
import { API_CONFIG } from "../api/config";
import { 
  checkProfileCompletion, 
  requestPasswordReset, 
  verifyResetToken, 
  resetPassword 
} from "../api/auth.jsx";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [resetRequestSent, setResetRequestSent] = useState(false);

  // Configure axios on component mount
  useEffect(() => {
    configureAxios();
  }, []);

  // Function to check profile completion
  const checkUserProfileCompletion = async (user) => {
    try {
      // Only check if user is an athlete
      if (user.userType === "athlete") {
        console.log('Checking profile completion for athlete:', user.email);
        const completed = await checkProfileCompletion(user.email);
        console.log('Profile completion status from backend:', completed);
        
        // Update the user's profile completion status
        setProfileCompleted(completed);
        
        // Also update the user object in localStorage
        if (completed !== user.profileCompleted) {
          const updatedUser = { ...user, profileCompleted: completed };
          setCurrentUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          console.log('Updated user profile completion status to:', completed);
        }
      } else {
        // For non-athletes, profile is considered complete
        setProfileCompleted(true);
      }
    } catch (err) {
      console.error("Failed to check profile completion:", err);
      // Default to false for safety
      setProfileCompleted(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    initSocket();
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      
      // Use the dedicated function for profile completion check
      checkUserProfileCompletion(user);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, userType) => {
    try {
      const url = `${API_CONFIG.AUTH_URL}/login`;
      console.log("Login request to:", url);
      
      const response = await axios.post(url, { email, password, userType });
      const { token, user } = response.data;
      
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      
      // Always check profile completion from backend for consistency
      await checkUserProfileCompletion(user);
      
      return { user, profileCompleted };
    } catch (error) {
      console.error("Login error:", error);
      
      // Enhanced error handling
      if (error.response) {
        // Server responded with an error code
        throw new Error(error.response.data?.error || "Authentication failed");
      } else if (error.request) {
        // Request made but no response received (network error)
        throw new Error("Network error - please check your connection or the server may be down");
      } else {
        // Error in request setup
        throw new Error(error.message || "Authentication failed");
      }
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
    
    // Also update the user object in localStorage if needed
    if (currentUser) {
      const updatedUser = { ...currentUser, profileCompleted: status };
      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
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