// Simulated backend API for fundraising data
// In a real application, this would make HTTP requests to a backend server

// Get fundraising opportunities from localStorage or initialize with sample data
const getFundraisingDataFromStorage = () => {
    const storedData = localStorage.getItem("fundraisingData")
  
    if (storedData) {
      return JSON.parse(storedData)
    }
  
    // Sample data if none exists in storage
    const sampleData = [
      {
        id: 1,
        trustName: "Kutraleeshwaran Sports Foundation (KSF)",
        website: "kutraleeshwaransportsfoundation.org",
        email: "sports@gmail.com",
        phone: "New Delhi",
        description: "Supporting athletes across various sports disciplines with financial aid and training resources.",
        applicationDeadline: "Open year-round",
        eligibilityRequirements: "National level athletes with demonstrated financial need",
      },
      {
        id: 2,
        trustName: "Athletes Sports India Federation (ASIF)",
        website: "sportsindiafederation.com",
        email: "contact@sportsindiafederation.com",
        phone: "Chennai",
        description: "Providing scholarships and equipment grants to promising young athletes.",
        applicationDeadline: "10th May 2025",
        eligibilityRequirements: "Athletes under 21 with state or national achievements",
      },
      {
        id: 3,
        trustName: "GoSports Foundation",
        website: "gosports.in",
        email: "info@gosports.in",
        phone: "Jaipur",
        description: "Offering comprehensive support including financial aid, training, and career guidance.",
        applicationDeadline: "25th June 2025",
        eligibilityRequirements: "Athletes in Olympic sports with proven track record",
      },
      {
        id: 4,
        trustName: "Saanjha",
        website: "saanjha.org",
        email: "support@saanjha.org",
        phone: "Lucknow",
        description: "Supporting rural athletes with financial assistance and training opportunities.",
        applicationDeadline: "12th July 2025",
        eligibilityRequirements: "Athletes from rural backgrounds with potential",
      },
      {
        id: 5,
        trustName: "FundRace",
        website: "fundrace.net",
        email: "apply@fundrace.net",
        phone: "Guwahati",
        description: "Crowdfunding platform specifically for athletes seeking financial support.",
        applicationDeadline: "15th August 2025",
        eligibilityRequirements: "All athletes eligible to create campaigns",
      },
    ]
  
    // Save sample data to localStorage
    localStorage.setItem("fundraisingData", JSON.stringify(sampleData))
  
    return sampleData
  }
  
  // Save fundraising data to localStorage
  const saveFundraisingDataToStorage = (data) => {
    localStorage.setItem("fundraisingData", JSON.stringify(data))
  }
  
  // Get all fundraising opportunities
  export const getAllFundraisingOpportunities = async () => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    return getFundraisingDataFromStorage()
  }
  
  // Get fundraising opportunity by ID
  export const getFundraisingOpportunityById = async (id) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 300))
  
    const opportunities = getFundraisingDataFromStorage()
    return opportunities.find((opportunity) => opportunity.id === id)
  }
  
  // Apply for fundraising opportunity
  export const applyForFundraising = async (opportunityId, applicationData) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800))
  
    // In a real application, this would send the application to a backend
    console.log(`Applied for opportunity ${opportunityId} with data:`, applicationData)
  
    return {
      success: true,
      message: "Application submitted successfully",
      applicationId: `APP-${Date.now()}-${opportunityId}`,
      submittedAt: new Date().toISOString(),
    }
  }
  
  // Get athlete's fundraising applications
  export const getAthleteApplications = async (athleteEmail) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 500))
  
    // In a real application, this would fetch the athlete's applications from a backend
    // For now, return mock data
    return [
      {
        id: `APP-${Date.now() - 5000000}-1`,
        opportunityId: 1,
        opportunityName: "Kutraleeshwaran Sports Foundation (KSF)",
        status: "Under Review",
        submittedAt: new Date(Date.now() - 5000000).toISOString(),
      },
      {
        id: `APP-${Date.now() - 10000000}-3`,
        opportunityId: 3,
        opportunityName: "GoSports Foundation",
        status: "Approved",
        submittedAt: new Date(Date.now() - 10000000).toISOString(),
        approvedAmount: "₹50,000",
      },
    ]
  }
  