"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"
import Footer from "../components/Footer"

const SettingsPage = () => {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    notifications: true,
    darkMode: darkMode,
  })
  
  // Update form data when dark mode changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      darkMode: darkMode
    }))
  }, [darkMode])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === "checkbox" ? checked : value
    
    setFormData({
      ...formData,
      [name]: newValue,
    })
    
    // Toggle dark mode when the dark mode checkbox is changed
    if (name === "darkMode" && type === "checkbox") {
      toggleDarkMode()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would implement the actual settings update logic
    alert("Settings updated successfully!")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="settings" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="Account Settings" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium mb-4">Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-700 focus:ring-yellow-600 border-gray-300 rounded"
                    />
                    <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                      Enable email notifications
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="darkMode"
                      name="darkMode"
                      checked={formData.darkMode}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-700">
                      Enable dark mode
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default SettingsPage
