// AI Assistant API functions
// In a real application, this would connect to a backend AI service

// Sample responses based on athlete data and query
const sampleResponses = {
    training: [
      "Based on your recent performance data, I recommend focusing on {sportSpecific} training. Your {metric} has improved by {improvement}% in the last month, which is excellent progress!",
      "Looking at your training history, I notice you've been consistent with {trainingType}. To reach your goal of {goal}, consider adding more {recommendedTraining} to your routine.",
      "Your recent {event} results show great improvement! To continue this trajectory, I suggest incorporating more {technique} drills into your training schedule.",
    ],
    nutrition: [
      "As a {sportsCategory} athlete, your nutrition needs are specific. Based on your training intensity, I recommend increasing your protein intake to {proteinAmount}g per day to support muscle recovery.",
      "Your performance data suggests you might benefit from more {nutrient}. Consider adding {foodSuggestions} to your diet to improve your {metric}.",
      "Hydration is key for your {sportsCategory} performance. Aim for {waterAmount} liters of water daily, and consider {electrolyteStrategy} before intense training sessions.",
    ],
    injury: [
      "I notice you've mentioned concerns about {injuryArea}. Based on your training load, this could be due to {cause}. Consider {recoveryStrategy} and consult with your sports physician.",
      "For your {injuryType} recovery, I recommend focusing on {rehabilitationExercise}. Your recent activity suggests you're ready to gradually return to {activity}.",
      "To prevent recurring {injuryType}, incorporate {preventionExercise} into your routine. This will strengthen your {muscleGroup} and improve stability.",
    ],
    mental: [
      "Mental preparation is crucial for {sportsCategory} athletes. Before your upcoming {event}, try {mentalTechnique} to improve focus and reduce anxiety.",
      "Your performance pattern shows you excel in {condition} but struggle with {challenge}. This is common among elite athletes. Try {copingStrategy} to build mental resilience.",
      "To maintain motivation through your {trainingPhase}, set small, achievable goals like {specificGoal}. Celebrate these victories to build confidence for {majorEvent}.",
    ],
    career: [
      "With your experience in {sportsCategory} and achievements like {achievement}, you might consider exploring opportunities in {careerPath}.",
      "Many athletes with your skill set find success in {industry} after their competitive career. Your strengths in {skill} would transfer well.",
      "Based on your profile, you might qualify for {sponsorshipType} sponsorships. Consider reaching out to {companySuggestion} who support athletes with your background.",
    ],
    general: [
      "I'm here to help you optimize your athletic journey! What specific aspect of your training or career would you like guidance on today?",
      "As your AI assistant, I can provide personalized advice based on your profile and performance data. What's your current focus or challenge?",
      "I'm analyzing your recent performance data and see some interesting patterns. Would you like insights on your {metric} or suggestions for improvement?",
    ],
  }
  
  // Helper function to get a random response from a category
  const getRandomResponse = (category) => {
    const responses = sampleResponses[category] || sampleResponses.general
    return responses[Math.floor(Math.random() * responses.length)]
  }
  
  // Helper function to personalize response with athlete data
  const personalizeResponse = (response, athleteData, performanceData) => {
    if (!athleteData) return response
  
    let personalized = response
  
    // Replace placeholders with actual data
    personalized = personalized.replace(/{sportsCategory}/g, athleteData.sportsCategory || "your sport")
    personalized = personalized.replace(/{goal}/g, athleteData.goals || "your athletic goals")
    personalized = personalized.replace(/{achievement}/g, athleteData.medalsAndAwards || "your achievements")
  
    // Sport-specific personalizations
    if (athleteData.sportsCategory === "athletics") {
      personalized = personalized.replace(/{sportSpecific}/g, "sprint technique and explosive power")
      personalized = personalized.replace(/{event}/g, "track events")
      personalized = personalized.replace(/{technique}/g, "starting block")
      personalized = personalized.replace(/{metric}/g, "sprint time")
    } else if (athleteData.sportsCategory === "swimming") {
      personalized = personalized.replace(/{sportSpecific}/g, "stroke efficiency and breathing technique")
      personalized = personalized.replace(/{event}/g, "swimming meets")
      personalized = personalized.replace(/{technique}/g, "flip turn")
      personalized = personalized.replace(/{metric}/g, "lap time")
    } else {
      personalized = personalized.replace(/{sportSpecific}/g, "technique and conditioning")
      personalized = personalized.replace(/{event}/g, "competitions")
      personalized = personalized.replace(/{technique}/g, "fundamental")
      personalized = personalized.replace(/{metric}/g, "performance metrics")
    }
  
    // Generic replacements
    personalized = personalized.replace(/{trainingType}/g, "strength training")
    personalized = personalized.replace(/{recommendedTraining}/g, "interval training")
    personalized = personalized.replace(/{proteinAmount}/g, "1.6-2.0")
    personalized = personalized.replace(/{nutrient}/g, "complex carbohydrates")
    personalized = personalized.replace(/{foodSuggestions}/g, "whole grains, sweet potatoes, and quinoa")
    personalized = personalized.replace(/{waterAmount}/g, "3-4")
    personalized = personalized.replace(/{electrolyteStrategy}/g, "electrolyte supplementation")
    personalized = personalized.replace(/{injuryArea}/g, "lower back")
    personalized = personalized.replace(/{cause}/g, "muscle imbalance")
    personalized = personalized.replace(/{recoveryStrategy}/g, "active recovery and targeted stretching")
    personalized = personalized.replace(/{injuryType}/g, "muscle strain")
    personalized = personalized.replace(/{rehabilitationExercise}/g, "progressive resistance training")
    personalized = personalized.replace(/{activity}/g, "full training load")
    personalized = personalized.replace(/{preventionExercise}/g, "core stability exercises")
    personalized = personalized.replace(/{muscleGroup}/g, "supporting muscles")
    personalized = personalized.replace(/{mentalTechnique}/g, "visualization and positive self-talk")
    personalized = personalized.replace(/{condition}/g, "high-pressure situations")
    personalized = personalized.replace(/{challenge}/g, "maintaining focus during long competitions")
    personalized = personalized.replace(/{copingStrategy}/g, "mindfulness meditation")
    personalized = personalized.replace(/{trainingPhase}/g, "off-season training")
    personalized = personalized.replace(/{specificGoal}/g, "improving your personal best by 2%")
    personalized = personalized.replace(/{majorEvent}/g, "the upcoming championship season")
    personalized = personalized.replace(/{careerPath}/g, "coaching or sports analysis")
    personalized = personalized.replace(/{industry}/g, "sports management or athletic training")
    personalized = personalized.replace(/{skill}/g, "discipline and performance under pressure")
    personalized = personalized.replace(/{sponsorshipType}/g, "performance equipment")
    personalized = personalized.replace(/{companySuggestion}/g, "brands in your sport's ecosystem")
    personalized = personalized.replace(/{improvement}/g, Math.floor(Math.random() * 10) + 5)
  
    return personalized
  }
  
  // Function to categorize user query
  const categorizeQuery = (query) => {
    query = query.toLowerCase()
  
    if (
      query.includes("train") ||
      query.includes("workout") ||
      query.includes("exercise") ||
      query.includes("practice")
    ) {
      return "training"
    } else if (query.includes("eat") || query.includes("food") || query.includes("diet") || query.includes("nutrition")) {
      return "nutrition"
    } else if (
      query.includes("injury") ||
      query.includes("pain") ||
      query.includes("hurt") ||
      query.includes("recover")
    ) {
      return "injury"
    } else if (
      query.includes("stress") ||
      query.includes("anxiety") ||
      query.includes("focus") ||
      query.includes("mental")
    ) {
      return "mental"
    } else if (
      query.includes("career") ||
      query.includes("job") ||
      query.includes("future") ||
      query.includes("sponsor")
    ) {
      return "career"
    } else {
      return "general"
    }
  }
  
  // Main function to generate AI response
  export const generateAIResponse = async (query, athleteData, performanceData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
  
    try {
      // Categorize the query
      const category = categorizeQuery(query)
  
      // Get a response template
      let response = getRandomResponse(category)
  
      // Personalize the response with athlete data
      response = personalizeResponse(response, athleteData, performanceData)
  
      return response
    } catch (error) {
      console.error("Error generating AI response:", error)
      return "I'm sorry, I encountered an error processing your request. Please try again."
    }
  }
  
  // Function to get training recommendations based on athlete data
  export const getTrainingRecommendations = async (athleteData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    // In a real application, this would analyze the athlete's data and return personalized recommendations
    return [
      "Increase sprint interval training to improve your explosive power",
      "Add more recovery days between high-intensity sessions",
      "Focus on technique refinement for your specific events",
      "Consider cross-training to prevent overuse injuries",
    ]
  }
  
  // Function to analyze performance trends
  export const analyzePerformanceTrends = async (performanceData) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
  
    // In a real application, this would analyze performance data and identify trends
    return {
      improving: ["Sprint speed", "Recovery time"],
      needsWork: ["Endurance", "Technique consistency"],
      recommendations: [
        "Your sprint times are improving consistently - keep up the good work!",
        "Consider adding more endurance training to your routine",
        "Work with your coach on technique consistency during fatigue",
      ],
    }
  }
  