// Mock API for events
const mockEvents = [
    {
      id: 1,
      name: "National Athletics Meet",
      sport: "Athletics",
      date: "15th April 2025",
      location: "New Delhi",
      registered: false,
      description: "Annual national athletics competition featuring top athletes from across the country.",
    },
    {
      id: 2,
      name: "Marathon Challenge 2025",
      sport: "Running",
      date: "10th May 2025",
      location: "Chennai",
      registered: true,
      description: "A challenging marathon event with various distance categories for all levels of runners.",
    },
    {
      id: 3,
      name: "Youth Wrestling Tournament",
      sport: "Wrestling",
      date: "25th June 2025",
      location: "Jaipur",
      registered: true,
      description: "Wrestling tournament for young athletes to showcase their skills and compete at a national level.",
    },
    {
      id: 4,
      name: "Senior Weightlifting Championship",
      sport: "Weightlifting",
      date: "12th July 2025",
      location: "Lucknow",
      registered: true,
      description: "Championship event for senior weightlifters with various weight categories.",
    },
    {
      id: 5,
      name: "National Gymnastics Meet",
      sport: "Gymnastics",
      date: "15th August 2025",
      location: "Guwahati",
      registered: false,
      description: "National gymnastics competition featuring individual and team events.",
    },
    {
      id: 6,
      name: "Boxing Selection Trials",
      sport: "Boxing",
      date: "30th August 2025",
      location: "Raipur",
      registered: true,
      description: "Selection trials for the national boxing team for upcoming international competitions.",
    },
  ]
  
  // Get all events
  export const getEvents = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvents)
      }, 500)
    })
  }
  
  // Get event by ID
  export const getEventById = async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const event = mockEvents.find((e) => e.id === Number.parseInt(id))
        if (event) {
          resolve(event)
        } else {
          reject(new Error("Event not found"))
        }
      }, 500)
    })
  }
  
  // Register for an event
  export const registerForEvent = async (eventId, athleteId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Registration successful" })
      }, 500)
    })
  }
  
  // Cancel registration for an event
  export const cancelEventRegistration = async (eventId, athleteId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: "Registration cancelled" })
      }, 500)
    })
  }
  
  // Get upcoming events
  export const getUpcomingEvents = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockEvents)
      }, 500)
    })
  }
  
  // Get past events
  export const getPastEvents = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 500)
    })
  }
  
  // Get ongoing events
  export const getOngoingEvents = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 500)
    })
  }
  