"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Login from "../components/login.png"
const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("athlete")
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { login, updateProfileStatus, setCurrentUser } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const { profileCompleted } = await login(email, password, userType)

      // Redirect based on profile completion status
      if (userType === "athlete" && !profileCompleted) {
        navigate("/athlete-details")
      } else {
        navigate("/dashboard")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error.message || "Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Yellow background with illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-yellow-400 flex-col justify-center items-center p-12">
      <div className="w-full max-w-md">
          <img src={Login} alt="Athlete dashboard" className="w-100 h-100" />
        </div>
        <div className="text-white mb-8 text-center flex flex-col items-center justify-center">
  <h2 className="text-2xl font-semibold mb-4">Advanced Athlete Management Platform</h2>
  <p className="text-lg max-w-xl">
    Everything you need to seamlessly manage athletes, track performance, and optimize training.
  </p>
</div>

        
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Sign In to your Account</h1>
            <p className="text-gray-600">Welcome back! please enter your detail</p>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-10"
                  placeholder="Email"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 pl-10"
                  placeholder="Password"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Login Type</label>
              <div className="flex">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center rounded-l-md ${
                    userType === "athlete" ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setUserType("athlete")}
                >
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Athlete
                  </div>
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 text-center rounded-r-md ${
                    userType === "user" ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setUserType("user")}
                >
                  <div className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    User
                  </div>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div>
                <Link to="/forgot-password" className="text-sm text-yellow-400 hover:text-yellow-500">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-md transition duration-200 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">Or sign in with</p>
            <div className="mt-4">
              <button className="w-full py-3 px-4 border border-gray-300 rounded-md flex items-center justify-center text-gray-700 hover:bg-gray-50 transition duration-200">
              <svg
  className="h-5 w-5 mr-2"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 533.5 544.3"
>
  <path
    fill="#4285F4"
    d="M533.5 278.4c0-17.7-1.6-35-4.7-51.7H272v97.9h146.9c-6.4 34-25.7 62.7-54.7 81.9v68h88.4c51.6-47.5 80.9-117.4 80.9-196.1z"
  />
  <path
    fill="#34A853"
    d="M272 544.3c73.7 0 135.6-24.5 180.8-66.4l-88.4-68c-24.6 16.5-56.3 26.2-92.4 26.2-71.1 0-131.4-48-153-112.9h-90.5v70.8c45.4 89.3 137.7 150.3 243.5 150.3z"
  />
  <path
    fill="#FBBC04"
    d="M119 323.2c-10.1-30-10.1-62.5 0-92.5v-70.8H28.5c-37.7 74.9-37.7 159.2 0 234.1L119 323.2z"
  />
  <path
    fill="#EA4335"
    d="M272 107.1c39.9-.6 78.1 13.8 107.3 40.6l80.1-80.1C415.3 25.3 345.5-1.3 272 0 166.2 0 73.9 60.9 28.5 150.2l90.5 70.8C140.6 155 200.9 107.1 272 107.1z"
  />
</svg>

                Google
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?
              <Link to="/login" className="text-yellow-400 hover:text-yellow-500 ml-1">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
