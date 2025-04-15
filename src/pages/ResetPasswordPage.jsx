"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { validateResetToken, completePasswordReset } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Extract email and token from URL query parameters
    const queryParams = new URLSearchParams(location.search)
    const emailParam = queryParams.get("email")
    const tokenParam = queryParams.get("token")

    if (emailParam && tokenParam) {
      setEmail(emailParam)
      setToken(tokenParam)

      // Validate the token
      validateResetToken(emailParam, tokenParam)
        .then(() => {
          setValidating(false)
        })
        .catch((error) => {
          setError("Invalid or expired reset link. Please request a new password reset.")
          setValidating(false)
        })
    } else {
      setError("Invalid reset link. Please request a new password reset.")
      setValidating(false)
    }
  }, [location, validateResetToken])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)

    try {
      await completePasswordReset(email, token, password)
      setSuccess(true)

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (error) {
      setError(error.message || "Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-pulse">
            <p className="text-gray-600">Validating your reset link...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Password</h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
            <p>Your password has been successfully reset!</p>
            <p className="mt-2">Redirecting to login page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-md transition duration-200 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-yellow-400 hover:text-yellow-500">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordPage
