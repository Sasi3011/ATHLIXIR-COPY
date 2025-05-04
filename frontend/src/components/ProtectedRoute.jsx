// Update the ProtectedRoute component to redirect based on profile completion
import { Navigate } from "react-router-dom"
;("use client")
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, profileCompleted } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // If the user is an athlete and hasn't completed their profile,
  // redirect to the athlete details page unless they're already there
  if (currentUser.userType === "athlete" && !profileCompleted && window.location.pathname !== "/athlete-details") {
    return <Navigate to="/athlete-details" replace />
  }

  return children
}

export default ProtectedRoute
