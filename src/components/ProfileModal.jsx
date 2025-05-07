"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

const ProfileModal = ({ athleteData, onClose, onLogout }) => {
  const navigate = useNavigate()
  const [profilePhoto, setProfilePhoto] = useState(athleteData?.profilePhoto || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const fileInputRef = useRef(null)

  // Function to get avatar image source
  const getAvatarSrc = () => {
    if (profilePhoto) {
      return profilePhoto
    }
    return `https://ui-avatars.com/api/?name=${athleteData?.fullName || "User"}&background=FFD700&color=fff&size=128`
  }

  // Function to navigate to the full profile page
  const handleViewFullProfile = () => {
    onClose() // Close the modal first
    navigate(`/profile/${athleteData?.id || "me"}`) // Use React Router's navigate for client-side navigation
  }

  // Function to handle notification click
  const handleNotificationClick = () => {
    onClose()
    navigate("/messages")
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Profile Information</h3>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
                )}

                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                  </div>
                )}

                <div className="flex flex-col items-center mb-6">
                  <img
                    src={getAvatarSrc() || "/placeholder.svg"}
                    alt="Profile"
                    className="h-24 w-24 rounded-full mb-2 object-cover"
                  />
                  <h2 className="text-xl font-semibold">{athleteData?.fullName}</h2>
                  <p className="text-gray-600">{athleteData?.sportsCategory}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                    <p className="mt-1">{athleteData?.fullName}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="mt-1">{athleteData?.email}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                    <p className="mt-1">{athleteData?.phone}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Sports Category</h4>
                    <p className="mt-1">{athleteData?.sportsCategory}</p>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={onLogout}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Logout
                    </button>
                    <button
                      type="button"
                      onClick={handleViewFullProfile}
                      className="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-200 text-base font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
