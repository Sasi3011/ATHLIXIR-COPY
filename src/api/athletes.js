// Simulated backend API for athlete profiles
// In a real application, this would make HTTP requests to a backend server

// Get athlete profiles from localStorage
const athleteProfiles = JSON.parse(localStorage.getItem("athleteProfiles")) || []

export const saveAthleteProfile = async (profileData) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Check if profile already exists
  const existingProfileIndex = athleteProfiles.findIndex((profile) => profile.email === profileData.email)

  if (existingProfileIndex !== -1) {
    // Update existing profile
    athleteProfiles[existingProfileIndex] = {
      ...athleteProfiles[existingProfileIndex],
      ...profileData,
      updatedAt: new Date().toISOString(),
    }
  } else {
    // Create new profile
    athleteProfiles.push({
      ...profileData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  // Save to localStorage
  localStorage.setItem("athleteProfiles", JSON.stringify(athleteProfiles))

  return true
}

export const getAthleteProfile = async (email) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const profile = athleteProfiles.find((profile) => profile.email === email)

  if (!profile) {
    throw new Error("Profile not found")
  }

  return profile
}

export const updateAthleteProfile = async (profileData) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Find profile index
  const profileIndex = athleteProfiles.findIndex((profile) => profile.email === profileData.email)

  if (profileIndex === -1) {
    throw new Error("Profile not found")
  }

  // Update profile
  athleteProfiles[profileIndex] = {
    ...athleteProfiles[profileIndex],
    ...profileData,
    updatedAt: new Date().toISOString(),
  }

  // Save to localStorage
  localStorage.setItem("athleteProfiles", JSON.stringify(athleteProfiles))

  return true
}

export const updateProfilePhoto = async (email, photoData) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Find profile index
  const profileIndex = athleteProfiles.findIndex((profile) => profile.email === email)

  if (profileIndex === -1) {
    throw new Error("Profile not found")
  }

  // Update profile with photo
  athleteProfiles[profileIndex] = {
    ...athleteProfiles[profileIndex],
    profilePhoto: photoData,
    updatedAt: new Date().toISOString(),
  }

  // Save to localStorage
  localStorage.setItem("athleteProfiles", JSON.stringify(athleteProfiles))

  return true
}

export const getAllAthleteProfiles = async () => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return athleteProfiles
}
