"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getAthleteProfile, updateAthleteProfile } from "../api/athletes"
import PageHeader from "../components/PageHeader"

const FullProfilePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [athleteData, setAthleteData] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    biography: "",
    sportsCategory: "",
    goals: "",
    address: "",
    skillLevel: "",
  })
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        if (currentUser?.email) {
          const data = await getAthleteProfile(currentUser.email)
          setAthleteData(data)
          setFormData({
            fullName: data?.fullName || "",
            email: data?.email || "",
            phone: data?.phone || "",
            biography: data?.biography || "",
            sportsCategory: data?.sportsCategory || "",
            goals: data?.goals || "",
            address: data?.address || "",
            skillLevel: data?.skillLevel || "",
          })
          setProfilePhoto(data?.profilePhoto || null)
        }
      } catch (error) {
        console.error("Error fetching athlete data:", error)
        setError("Failed to load profile data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchAthleteData()
  }, [currentUser])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data to original values
    if (athleteData) {
      setFormData({
        fullName: athleteData?.fullName || "",
        email: athleteData?.email || "",
        phone: athleteData?.phone || "",
        biography: athleteData?.biography || "",
        sportsCategory: athleteData?.sportsCategory || "",
        goals: athleteData?.goals || "",
        address: athleteData?.address || "",
        skillLevel: athleteData?.skillLevel || "",
      })
      setProfilePhoto(athleteData?.profilePhoto || null)
    }
    setError("")
    setSuccess("")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo size should not exceed 5MB")
        return
      }

      // Check file type
      if (!file.type.match("image.*")) {
        setError("Please select an image file")
        return
      }

      setError("")

      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result) // Store base64 string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError("")

      await updateAthleteProfile({
        ...athleteData,
        ...formData,
        profilePhoto,
      })

      setSuccess("Profile updated successfully!")
      setIsEditing(false)

      // Update local state with new data
      setAthleteData({
        ...athleteData,
        ...formData,
        profilePhoto,
      })

      // Wait 2 seconds and clear success message
      setTimeout(() => {
        setSuccess("")
      }, 2000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleBackToDashboard = () => {
    navigate("/dashboard")
  }

  const renderValue = (value) => {
    return value ? value : <span className="text-gray-400">Not provided</span>
  }

  // Function to get avatar image source
  const getAvatarSrc = () => {
    if (profilePhoto) {
      return profilePhoto
    }
    if (athleteData?.profilePhoto) {
      return athleteData.profilePhoto
    }
    return `https://ui-avatars.com/api/?name=${formData.fullName || athleteData?.fullName || "User"}&background=FFD700&color=fff&size=128`
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading profile...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white shadow-md">
          <PageHeader title="Full Profile" />
        </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back to Dashboard Button */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center text-gray-700 hover:text-yellow-500 transition-colors duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>

          <div className="hidden md:block">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 px-4 py-1 rounded-full shadow-sm">
              <span className="text-white font-medium">Athlete Profile</span>
            </div>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 mb-3 border-t-4 border-yellow-400">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-100 shadow-lg">
              {isEditing ? (
                <div className="relative">
                  <img
                    src={getAvatarSrc() || "/placeholder.svg?height=128&width=128"}
                    alt={formData.fullName || athleteData?.fullName || "Athlete"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0">
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2 shadow-md"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      <span className="sr-only">Upload Photo</span>
                    </label>
                    <input
                      id="photo-upload"
                      name="photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </div>
                </div>
              ) : (
                <img
                  src={getAvatarSrc() || "/placeholder.svg?height=128&width=128"}
                  alt={athleteData?.fullName || "Athlete"}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                      />
                    ) : (
                      renderValue(athleteData?.fullName)
                    )}
                  </h1>
                  <p className="text-gray-600">
                    {isEditing ? (
                      <select
                        name="sportsCategory"
                        value={formData.sportsCategory}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                      >
                        <option value="">Select Sports Category</option>
                        <option value="athletics">Athletics</option>
                        <option value="swimming">Swimming</option>
                        <option value="cycling">Cycling</option>
                        <option value="basketball">Basketball</option>
                        <option value="football">Football</option>
                        <option value="tennis">Tennis</option>
                        <option value="cricket">Cricket</option>
                        <option value="hockey">Hockey</option>
                        <option value="badminton">Badminton</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      renderValue(athleteData?.sportsCategory)
                    )}
                  </p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded shadow-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded shadow-md transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className={`bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded shadow-md transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div>
                  <h3 className="text-sm text-gray-500">Email Address</h3>
                  <p className="font-medium">
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-100"
                        disabled
                      />
                    ) : (
                      renderValue(athleteData?.email)
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Phone Number</h3>
                  <p className="font-medium">
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                      />
                    ) : (
                      renderValue(athleteData?.phone)
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Address</h3>
                  <p className="font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    ) : (
                      renderValue(athleteData?.address)
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">Skill Level</h3>
                  <p className="font-medium">
                    {isEditing ? (
                      <select
                        name="skillLevel"
                        value={formData.skillLevel}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      >
                        <option value="">Select Skill Level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="professional">Professional</option>
                      </select>
                    ) : (
                      renderValue(athleteData?.skillLevel)
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
            <h2 className="text-xl font-semibold mb-4">Profile Sections</h2>
            <nav>
              <ul className="space-y-2">
                <li className="py-2 px-3 bg-blue-50 text-blue-600 rounded">Biography</li>
                {/* <li className="py-2 px-3 hover:bg-gray-100 rounded transition-colors duration-200">
                  Achievements & Records
                </li> */}
                <li className="py-2 px-3 hover:bg-gray-100 rounded transition-colors duration-200">
                  Skills & Strengths
                </li>
                <li className="py-2 px-3 hover:bg-gray-100 rounded transition-colors duration-200">
                  Competition History
                </li>
                <li className="py-2 px-3 hover:bg-gray-100 rounded transition-colors duration-200">
                  Training & Certifications
                </li> 
                {/* <li className="py-2 px-3 hover:bg-gray-100 rounded transition-colors duration-200">Language</li>
                <li className="py-2 px-3 hover:bg-gray-100 rounded transition-colors duration-200">
                  Contact & Socials
                </li>
                <li className="py-2 px-3 hover:bg-gray-100 rounded transition-colors duration-200">Interest</li>
                <li className="py-2 px-3 hover:bg-gray-100 rounded transition-colors duration-200">Recommendation</li> */}
              </ul>
            </nav>

            <div className="mt-8">
              <h3 className="font-medium mb-2">Complete Your Profile</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: "80%" }}></div>
              </div>
              <p className="text-right text-sm text-gray-600 mt-1">80%</p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-yellow-400">
              <h2 className="text-xl font-semibold mb-4">Biography</h2>
              {isEditing ? (
                <textarea
                  name="biography"
                  value={formData.biography}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                ></textarea>
              ) : (
                <p className="text-gray-700">{renderValue(athleteData?.biography)}</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Athletic Skills</h2>
              <div className="flex flex-wrap gap-2">
                {athleteData?.athleticSkills ? (
                  athleteData.athleticSkills.map((skill, index) => (
                    <span key={index} className="text-gray-700">
                      {skill}
                      {index < athleteData.athleticSkills.length - 1 ? " | " : ""}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No athletic skills provided</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Career Goals</h2>
              {isEditing ? (
                <input
                  type="text"
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {athleteData?.goals ? (
                    <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full">{athleteData.goals}</span>
                  ) : (
                    <span className="text-gray-400">No career goals provided</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FullProfilePage
