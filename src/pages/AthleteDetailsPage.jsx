"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { saveAthleteProfile } from "../api/athletes"

const AthleteDetailsPage = () => {
  const navigate = useNavigate()
  const { currentUser, updateProfileStatus } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Personal details (Step 1)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [address, setAddress] = useState("")
  const [district, setDistrict] = useState("")
  const [state, setState] = useState("")
  const [phone, setPhone] = useState("")
  const [nationality, setNationality] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [gender, setGender] = useState("")
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)

  // Sports details (Step 2)
  const [sportsCategory, setSportsCategory] = useState("")
  const [biography, setBiography] = useState("")
  const [yearsOfExperience, setYearsOfExperience] = useState("")
  const [athleteType, setAthleteType] = useState("")
  const [languagesSpoken, setLanguagesSpoken] = useState("")
  const [medalsAndAwards, setMedalsAndAwards] = useState("")
  const [competingSince, setCompetingSince] = useState("")
  const [goals, setGoals] = useState("")

  useEffect(() => {
    // Set email from current user but don't pre-fill other fields
    setEmail(currentUser?.email || "")
  }, [currentUser])

  const validateStep1 = () => {
    if (!fullName || !email || !address || !district || !state || !phone || !nationality || !dateOfBirth || !gender) {
      setError("Please fill in all fields")
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (
      !sportsCategory ||
      !biography ||
      !yearsOfExperience ||
      !athleteType ||
      !languagesSpoken ||
      !competingSince ||
      !goals
    ) {
      setError("Please fill in all fields")
      return false
    }
    return true
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    setError("")
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
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
      if (!file.type.match('image.*')) {
        setError("Please select an image file")
        return
      }

      setError("")
      
      // Create a preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
        setProfilePhoto(reader.result) // Store base64 string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setProfilePhoto(null)
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateStep2()) {
      return
    }

    try {
      setLoading(true)

      const profileData = {
        userId: currentUser.id,
        email: currentUser.email,
        fullName,
        address,
        district,
        state,
        phone,
        nationality,
        dateOfBirth,
        gender,
        sportsCategory,
        biography,
        yearsOfExperience,
        athleteType,
        languagesSpoken,
        medalsAndAwards,
        competingSince,
        goals,
        profilePhoto, // Include the profile photo
      }

      await saveAthleteProfile(profileData)
      updateProfileStatus(true)
      navigate("/dashboard")
    } catch (error) {
      console.error("Error saving profile:", error)
      setError("Failed to save profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Prevent form submission on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-yellow-400 mb-6">Athlete Details</h1>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
            )}

            {step === 1 ? (
              // Step 1: Personal Details
              <form onSubmit={handleNextStep} onKeyDown={handleKeyDown}>
                <div className="space-y-6">
                  {/* Profile Photo Upload */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                      {photoPreview ? (
                        <img 
                          src={photoPreview || "/placeholder.svg"} 
                          alt="Profile Preview" 
                          className="h-32 w-32 rounded-full object-cover border-4 border-yellow-400"
                        />
                      ) : (
                        <div className="h-32 w-32 rounded-full bg-yellow-400 flex items-center justify-center text-white text-4xl font-bold">
                          {fullName ? fullName.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 right-0">
                        <label htmlFor="photo-upload" className="cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2 shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
                          ref={fileInputRef}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-2 text-center">
                      <p className="text-sm text-gray-500">Upload your profile photo</p>
                      {photoPreview && (
                        <button 
                          type="button" 
                          onClick={handleRemovePhoto}
                          className="mt-1 text-xs text-red-500 hover:text-red-700"
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>

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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-100"
                        disabled
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
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

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                        District
                      </label>
                      <div className="relative">
                        <input
                          id="district"
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
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
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <div className="relative">
                        <input
                          id="state"
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
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
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone No.
                      </label>
                      <div className="relative">
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
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
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                        Nationality
                      </label>
                      <div className="relative">
                        <input
                          id="nationality"
                          type="text"
                          value={nationality}
                          onChange={(e) => setNationality(e.target.value)}
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
                              d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <div className="relative">
                        <input
                          id="dateOfBirth"
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
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

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-md transition duration-200"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              // Step 2: Sports Details
              <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="sportsCategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Sports Category
                    </label>
                    <div className="relative">
                      <select
                        id="sportsCategory"
                        value={sportsCategory}
                        onChange={(e) => setSportsCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
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
                    <label htmlFor="biography" className="block text-sm font-medium text-gray-700 mb-1">
                      Biography
                    </label>
                    <div className="relative">
                      <textarea
                        id="biography"
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                      ></textarea>
                      <div className="absolute top-2 right-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="athleteType" className="block text-sm font-medium text-gray-700 mb-1">
                        Sports Category (Para-Athlete/Athlete)
                      </label>
                      <div className="relative">
                        <select
                          id="athleteType"
                          value={athleteType}
                          onChange={(e) => setAthleteType(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="athlete">Athlete</option>
                          <option value="para-athlete">Para-Athlete</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="languagesSpoken" className="block text-sm font-medium text-gray-700 mb-1">
                        Language Spoken
                      </label>
                      <div className="relative">
                        <input
                          id="languagesSpoken"
                          type="text"
                          value={languagesSpoken}
                          onChange={(e) => setLanguagesSpoken(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="e.g. English, Spanish"
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
                              d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.20l-.31 1.242c-.412 1.65-1.46 3.112-2.882 4.16a1 1 0 01-1.14-1.644c1.2-.836 2.03-1.896 2.369-3.158L7 5H5a1 1 0 110-2h1V3a1 1 0 011-1zm10 8a1 1 0 01-1 1h-3.20l-.31 1.242c-.412 1.65-1.46 3.112-2.882 4.16a1 1 0 01-1.14-1.644c1.2-.836 2.03-1.896 2.369-3.158L11 11h-1a1 1 0 110-2h2a1 1 0 011 1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="medalsAndAwards" className="block text-sm font-medium text-gray-700 mb-1">
                        Medals & Awards
                      </label>
                      <div className="relative">
                        <input
                          id="medalsAndAwards"
                          type="text"
                          value={medalsAndAwards}
                          onChange={(e) => setMedalsAndAwards(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="e.g. Olympic Gold, National Championship"
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
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="competingSince" className="block text-sm font-medium text-gray-700 mb-1">
                        Competing Since
                      </label>
                      <div className="relative">
                        <input
                          id="competingSince"
                          type="date"
                          value={competingSince}
                          onChange={(e) => setCompetingSince(e.target.value)}
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

                  <div>
                    <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
                      Goals
                    </label>
                    <div className="relative">
                      <input
                        id="goals"
                        type="text"
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="e.g. Olympic qualification, National record"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-md transition duration-200"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-md transition duration-200 ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AthleteDetailsPage
