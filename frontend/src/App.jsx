import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import AthleteDetailsPage from "./pages/AthleteDetailsPage"
import AthleteDashboard from "./pages/AthleteDashboard"
import PerformancePage from "./pages/PerformancePage"
import AnalyticsPage from "./pages/AnalyticsPage"
import DocumentUploadPage from "./pages/DocumentUploadPage"
import AIAssistantPage from "./pages/AIAssistantPage"
import FundraisingPage from "./pages/FundraisingPage"
import MessagesPage from "./pages/MessagesPage"
import AchievementsPage from "./pages/AchievementsPage"
import EventsPage from "./pages/EventsPage"
import AcademyLocatorPage from "./pages/AcademyLocatorPage"
import SportsNewsPage from "./pages/SportsNewsPage"
import SettingsPage from "./pages/SettingsPage"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import FullProfilePage from "./pages/FullProfilePage"
import "./App.css"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AthleteDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/athlete-details"
            element={
              <ProtectedRoute>
                <AthleteDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <ProtectedRoute>
                <PerformancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document-upload"
            element={
              <ProtectedRoute>
                <DocumentUploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-assistant"
            element={
              <ProtectedRoute>
                <AIAssistantPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/financial-support"
            element={
              <ProtectedRoute>
                <FundraisingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <AchievementsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/academy-locator"
            element={
              <ProtectedRoute>
                <AcademyLocatorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sports-news"
            element={
              <ProtectedRoute>
                <SportsNewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <FullProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
