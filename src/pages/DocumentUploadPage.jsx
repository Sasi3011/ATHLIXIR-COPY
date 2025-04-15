"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Sidebar from "../components/Sidebar"
import { getAthleteProfile } from "../api/athletes"
import { uploadMedicalDocument } from "../api/performance"

const DocumentUploadPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [athleteData, setAthleteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form fields
  const [fullName, setFullName] = useState("")
  const [dateOfIssue, setDateOfIssue] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const [gender, setGender] = useState("")
  const [hospitalName, setHospitalName] = useState("")
  const [file, setFile] = useState(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        if (currentUser && currentUser.email) {
          const data = await getAthleteProfile(currentUser.email)
          setAthleteData(data)

          // Pre-fill some fields from athlete data
          if (data) {
            setFullName(data.fullName || "")
            setGender(data.gender || "")
          }
        }
      } catch (error) {
        console.error("Error fetching athlete data:", error)
        setError("Failed to load athlete data")
      } finally {
        setLoading(false)
      }
    }

    fetchAthleteData()
  }, [currentUser])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      setError("Please upload a medical certificate")
      return
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      const documentData = {
        fullName,
        dateOfIssue,
        bloodGroup,
        gender,
        hospitalName,
        file,
        documentType: "Medical Certificate",
        email: currentUser.email,
        uploadedAt: new Date().toISOString(),
      }

      await uploadMedicalDocument(currentUser.email, documentData)

      setSuccess("Document uploaded successfully! It will be verified by our team.")

      // Redirect to analytics page after successful upload
      setTimeout(() => {
        navigate("/analytics")
      }, 2000)
    } catch (error) {
      console.error("Error uploading document:", error)
      setError("Failed to upload document. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleClearForm = () => {
    setFullName(athleteData?.fullName || "")
    setDateOfIssue("")
    setBloodGroup("")
    setGender(athleteData?.gender || "")
    setHospitalName("")
    setFile(null)
    setTermsAccepted(false)
    setError("")
    setSuccess("")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="performance" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-800">Document Upload</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="relative">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                  <span className="sr-only">Notifications</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src={`https://ui-avatars.com/api/?name=${athleteData?.fullName || "User"}&background=FFD700&color=fff`}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border-2 border-yellow-400"
                  />
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">{athleteData?.fullName || "Athlete"}</span>
                  <span className="text-xs text-gray-500">{athleteData?.sportsCategory || "Athlete"}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-yellow-400 mb-6">Medical Requirements</h2>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dateOfIssue" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of issue
                  </label>
                  <div className="relative">
                    <input
                      id="dateOfIssue"
                      type="date"
                      value={dateOfIssue}
                      onChange={(e) => setDateOfIssue(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <div className="relative">
                    <select
                      id="bloodGroup"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                      required
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital Name
                </label>
                <input
                  id="hospitalName"
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter hospital name"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="medicalCertificate" className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Certificate
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-400 hover:text-yellow-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-yellow-400"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="application/pdf,image/*"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF or image up to 10MB</p>
                  </div>
                </div>
                {file && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Selected file: {file.name}</p>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-yellow-400 rounded"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I confirm the information is accurate and agree to the Terms & Conditions. I authorize AI-based
                    verification of my uploaded medical documents for validation and fraud detection.
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition duration-200"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`py-2 px-4 bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded-md transition duration-200 ${
                    submitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DocumentUploadPage
