"use client"

import { useNavigate } from "react-router-dom"
import { Bell } from "lucide-react"
import { useState, useEffect } from "react"
import ProfileModal from "./ProfileModal"
import { useAuth } from "../context/AuthContext"
import { getAthleteProfile } from "../api/athletes"

const PageHeader = ({ title }) => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [athleteData, setAthleteData] = useState(null)

  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        if (currentUser?.email) {
          const data = await getAthleteProfile(currentUser.email)
          setAthleteData(data)
        }
      } catch (error) {
        console.error("Error fetching athlete data:", error)
      }
    }

    fetchAthleteData()
  }, [currentUser])

  const toggleProfileModal = () => {
    setShowProfileModal(!showProfileModal)
  }

  const handleLogout = () => {
    navigate("/login")
  }

  const handleNotificationClick = () => {
    navigate("/messages")
  }

  const getInitials = (name) => {
    if (name)
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
  }

  // Function to get avatar image source
  const getAvatarSrc = () => {
    if (athleteData?.profilePhoto) {
      return athleteData.profilePhoto
    }
    return `https://ui-avatars.com/api/?name=${athleteData?.fullName || "User"}&background=FFD700&color=fff&size=128`
  }

  // Add a function to navigate to the full profile page when clicking the profile photo
  const handleProfileClick = () => {
    if (athleteData) {
      navigate(`/profile/${currentUser?.uid || "me"}`)
    }
  }

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={handleNotificationClick}
            >
              <span className="sr-only">Notifications</span>
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>
          </div>

          {/* Show only when athleteData is ready */}
          {athleteData && (
            <div className="relative">
              <button onClick={toggleProfileModal} className="flex items-center space-x-3 focus:outline-none">
                <div className="flex-shrink-0">
                  <img
                    src={getAvatarSrc() || "/placeholder.svg"}
                    alt={athleteData.fullName || "Profile"}
                    className="h-10 w-10 rounded-full object-cover cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleProfileClick()
                    }}
                  />
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">{athleteData.fullName}</span>
                  <span className="text-xs text-gray-500">{athleteData.sportsCategory}</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {showProfileModal && athleteData && (
        <ProfileModal athleteData={athleteData} onClose={toggleProfileModal} onLogout={handleLogout} />
      )}
    </header>
  )
}

export default PageHeader
