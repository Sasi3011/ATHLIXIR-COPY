// Simulated backend API for authentication
// In a real application, this would make HTTP requests to a backend server

// Simulated user database
let users = JSON.parse(localStorage.getItem("users")) || []
const athleteProfiles = JSON.parse(localStorage.getItem("athleteProfiles")) || []

// Initialize with some sample data if empty
if (users.length === 0) {
  users = [
    { id: 1, email: "athlete@example.com", password: "password123" },
    { id: 2, email: "user@example.com", password: "password123" },
    { id: 3, email: "abc@gmail.com", password: "password123" }, // Add our test user
  ]
  localStorage.setItem("users", JSON.stringify(users))
}

// Modify the getUser function to provide specific error messages
export const getUser = async (email, password) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    // First check if the email exists
    const userWithEmail = users.find((u) => u.email === email)

    if (!userWithEmail) {
      throw new Error("Email not found. Please check your email or register.")
    }

    // Then check if the password matches
    if (userWithEmail.password !== password) {
      throw new Error("Incorrect password. Please try again.")
    }

    // If we get here, both email and password are correct
    return {
      id: userWithEmail.id,
      email: userWithEmail.email,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    throw error // Pass the specific error message up
  }
}

export const registerUser = async (email, password, userType) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if user already exists
  const existingUser = users.find((u) => u.email === email)

  if (existingUser) {
    throw new Error("User already exists")
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    email,
    password,
    userType,
  }

  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  return {
    id: newUser.id,
    email: newUser.email,
  }
}

// Update the checkProfileCompletion function to properly check if a profile exists in localStorage
export const checkProfileCompletion = async (email) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Get athlete profiles from localStorage
  const athleteProfiles = JSON.parse(localStorage.getItem("athleteProfiles")) || []

  // Check if a profile with the given email exists
  const athleteProfile = athleteProfiles.find((profile) => profile.email === email)

  return !!athleteProfile
}

// Add password reset functionality
export const requestPasswordReset = async (email) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Check if the email exists
  const user = users.find((u) => u.email === email)

  if (!user) {
    throw new Error("Email not found. Please check your email or register.")
  }

  // In a real application, this would send an email with a reset link/code
  // For this simulation, we'll just generate a reset token and store it
  const resetToken = Math.random().toString(36).substring(2, 15)

  // Store the token with the user (in a real app, this would be in a database)
  user.resetToken = resetToken
  user.resetTokenExpiry = Date.now() + 3600000 // 1 hour expiry

  localStorage.setItem("users", JSON.stringify(users))

  return { success: true, message: "Password reset email sent" }
}

export const verifyResetToken = async (email, token) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = users.find((u) => u.email === email)

  if (!user || user.resetToken !== token || user.resetTokenExpiry < Date.now()) {
    throw new Error("Invalid or expired reset token")
  }

  return { success: true }
}

export const resetPassword = async (email, token, newPassword) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = users.find((u) => u.email === email)

  if (!user || user.resetToken !== token || user.resetTokenExpiry < Date.now()) {
    throw new Error("Invalid or expired reset token")
  }

  // Update the password
  user.password = newPassword

  // Clear the reset token
  delete user.resetToken
  delete user.resetTokenExpiry

  localStorage.setItem("users", JSON.stringify(users))

  return { success: true, message: "Password reset successful" }
}
