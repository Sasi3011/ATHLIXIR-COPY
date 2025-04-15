"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { checkProfileCompletion, requestPasswordReset, verifyResetToken, resetPassword } from "../api/auth"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileCompleted, setProfileCompleted] = useState(false)
  const [resetRequestSent, setResetRequestSent] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      const user = JSON.parse(storedUser)
      setCurrentUser(user)

      // Check if athlete has completed their profile
      if (user.userType === "athlete") {
        checkProfileCompletion(user.email)
          .then((completed) => {
            setProfileCompleted(completed)
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  // Update the login function to check if the profile is completed
  const login = async (email, password, userType) => {
    try {
      // If it's our specific test user, bypass authentication
      if (email === "athlete3031@gmail.com" && userType === "athlete") {
        const user = {
          id: 999,
          email,
          userType,
        }

        // Check if the profile is already completed
        const isProfileCompleted = await checkProfileCompletion(email)

        setCurrentUser(user)
        setProfileCompleted(isProfileCompleted)
        localStorage.setItem("user", JSON.stringify(user))

        return { user, profileCompleted: isProfileCompleted }
      }

      // For any other user, create a mock user
      const user = {
        id: 1000,
        email,
        userType,
      }

      // Check if the profile is already completed
      const isProfileCompleted = await checkProfileCompletion(email)

      setCurrentUser(user)
      setProfileCompleted(isProfileCompleted)
      localStorage.setItem("user", JSON.stringify(user))

      return { user, profileCompleted: isProfileCompleted }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    setCurrentUser(null)
    setProfileCompleted(false)
    localStorage.removeItem("user")
  }

  const updateProfileStatus = (status) => {
    setProfileCompleted(status)
  }

  // Add password reset functions
  const forgotPassword = async (email) => {
    try {
      const result = await requestPasswordReset(email)
      setResetRequestSent(true)
      return result
    } catch (error) {
      console.error("Password reset request error:", error)
      throw error
    }
  }

  const validateResetToken = async (email, token) => {
    try {
      return await verifyResetToken(email, token)
    } catch (error) {
      console.error("Token validation error:", error)
      throw error
    }
  }

  const completePasswordReset = async (email, token, newPassword) => {
    try {
      const result = await resetPassword(email, token, newPassword)
      setResetRequestSent(false)
      return result
    } catch (error) {
      console.error("Password reset error:", error)
      throw error
    }
  }

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
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
