// Simulated backend API for achievements
// In a real application, this would make HTTP requests to a backend server

// Get achievements from localStorage or initialize with sample data
const getAchievementsFromStorage = () => {
    const storedData = localStorage.getItem("achievements")
  
    if (storedData) {
      return JSON.parse(storedData)
    }
  
    // Sample data if none exists in storage
    const now = new Date()
    const sampleData = [
      {
        id: "1",
        title: "Gold Medal - 100m Sprint",
        event: "National Athletics Meet - 2023",
        medalType: "gold",
        date: new Date(2023, 11, 10).toISOString(), // December 10, 2023
        startDate: new Date(2023, 9, 1).toISOString(), // October 1, 2023
        endDate: new Date(2023, 11, 31).toISOString(), // December 31, 2023
        description: "Won gold medal in the 100m sprint at the National Athletics Meet 2023.",
        isCareerHighlight: true,
        isPersonalBest: true,
        performanceDetails: [
          { label: "Sprint Time", value: "10.15 sec" },
          { label: "Rank", value: "1st Place" },
        ],
        athleteEmail: "athlete@example.com",
        createdAt: new Date(2023, 11, 15).toISOString(),
      },
      {
        id: "2",
        title: "Silver Medal - 200m Sprint",
        event: "State Championships - 2023",
        medalType: "silver",
        date: new Date(2023, 10, 15).toISOString(), // November 15, 2023
        startDate: new Date(2023, 9, 1).toISOString(), // October 1, 2023
        endDate: new Date(2023, 11, 31).toISOString(), // December 31, 2023
        description: "Won silver medal in the 200m sprint at the State Championships 2023.",
        isCareerHighlight: true,
        isPersonalBest: false,
        performanceDetails: [
          { label: "Sprint Time", value: "21.45 sec" },
          { label: "Previous Best", value: "21.80 sec" },
        ],
        athleteEmail: "athlete@example.com",
        createdAt: new Date(2023, 10, 20).toISOString(),
      },
      {
        id: "3",
        title: "Bronze Medal - 4×100m Relay",
        event: "Asian Games - 2022",
        medalType: "bronze",
        date: new Date(2022, 9, 5).toISOString(), // October 5, 2022
        startDate: new Date(2022, 9, 1).toISOString(), // October 1, 2022
        endDate: new Date(2022, 11, 31).toISOString(), // December 31, 2022
        description: "Won bronze medal in the 4×100m relay at the Asian Games 2022.",
        isCareerHighlight: true,
        isPersonalBest: false,
        performanceList: ["Relay Time: 38.85 sec", "Team Rank: 3rd Place"],
        athleteEmail: "athlete@example.com",
        createdAt: new Date(2022, 9, 10).toISOString(),
      },
      {
        id: "4",
        title: "State Champion - 200m Sprint",
        event: "State Athletics Championship",
        medalType: "state",
        date: new Date(2021, 11, 15).toISOString(), // December 15, 2021
        startDate: new Date(2021, 9, 1).toISOString(), // October 1, 2021
        endDate: new Date(2021, 11, 31).toISOString(), // December 31, 2021
        description:
          "Quis augue enim a magna feugiat massa, ligula. Proin libero vel in at hac. In ipsum, tempor velit, metus. Nibh dolor tortor quam volutat sit.",
        isCareerHighlight: false,
        isPersonalBest: false,
        athleteEmail: "athlete@example.com",
        createdAt: new Date(2021, 11, 20).toISOString(),
      },
      {
        id: "5",
        title: "Qualified for National team -100m",
        event: "National Team Qualifiers",
        medalType: "national",
        date: new Date(2021, 11, 5).toISOString(), // December 5, 2021
        startDate: new Date(2021, 9, 1).toISOString(), // October 1, 2021
        endDate: new Date(2021, 11, 31).toISOString(), // December 31, 2021
        description:
          "Quis augue enim a magna feugiat massa, ligula. Proin libero vel in at hac. In ipsum, tempor velit, metus. Nibh dolor tortor quam volutat sit.",
        isCareerHighlight: true,
        isPersonalBest: false,
        athleteEmail: "athlete@example.com",
        createdAt: new Date(2021, 11, 10).toISOString(),
      },
      {
        id: "6",
        title: "New Personal Best - 400m sprint",
        event: "Training Session",
        medalType: "personal",
        date: new Date(2021, 11, 20).toISOString(), // December 20, 2021
        startDate: new Date(2021, 9, 1).toISOString(), // October 1, 2021
        endDate: new Date(2021, 11, 31).toISOString(), // December 31, 2021
        description:
          "Quis augue enim a magna feugiat massa, ligula. Proin libero vel in at hac. In ipsum, tempor velit, metus. Nibh dolor tortor quam volutat sit.",
        isCareerHighlight: false,
        isPersonalBest: true,
        athleteEmail: "athlete@example.com",
        createdAt: new Date(2021, 11, 25).toISOString(),
      },
    ]
  
    // Save sample data to localStorage
    localStorage.setItem("achievements", JSON.stringify(sampleData))
  
    return sampleData
  }
  
  // Save achievements to localStorage
  const saveAchievementsToStorage = (achievements) => {
    localStorage.setItem("achievements", JSON.stringify(achievements))
  }
  
  // Get all achievements for an athlete
  export const getAchievements = async (athleteEmail) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    const achievements = getAchievementsFromStorage()
  
    // Filter achievements by athlete email
    return achievements.filter((achievement) => achievement.athleteEmail === athleteEmail)
  }
  
  // Get a single achievement by ID
  export const getAchievementById = async (achievementId) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 300))
  
    const achievements = getAchievementsFromStorage()
    return achievements.find((achievement) => achievement.id === achievementId)
  }
  
  // Add a new achievement
  export const addAchievement = async (achievementData) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800))
  
    const achievements = getAchievementsFromStorage()
  
    // Add new achievement
    const newAchievement = {
      ...achievementData,
      id: achievementData.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
  
    achievements.unshift(newAchievement) // Add to beginning of array
  
    // Save updated achievements
    saveAchievementsToStorage(achievements)
  
    return newAchievement
  }
  
  // Update an existing achievement
  export const updateAchievement = async (achievementId, achievementData) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    const achievements = getAchievementsFromStorage()
  
    // Find achievement index
    const achievementIndex = achievements.findIndex((achievement) => achievement.id === achievementId)
  
    if (achievementIndex === -1) {
      throw new Error("Achievement not found")
    }
  
    // Update achievement
    const updatedAchievement = {
      ...achievements[achievementIndex],
      ...achievementData,
      updatedAt: new Date().toISOString(),
    }
  
    achievements[achievementIndex] = updatedAchievement
  
    // Save updated achievements
    saveAchievementsToStorage(achievements)
  
    return updatedAchievement
  }
  
  // Delete an achievement
  export const deleteAchievement = async (achievementId) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    const achievements = getAchievementsFromStorage()
  
    // Filter out the achievement to delete
    const updatedAchievements = achievements.filter((achievement) => achievement.id !== achievementId)
  
    // Save updated achievements
    saveAchievementsToStorage(updatedAchievements)
  
    return { success: true }
  }
  