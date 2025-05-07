// Mock data for academies
const academiesData = [
  {
    id: 1,
    name: "KOVAI SPORTS ACADEMY",
    address: "22HH+V93, Civil Aerodrome Post, Coimbatore, Tamil Nadu 641014",
    rating: 4.9,
    reviews: 33,
    type: "Sports club",
    location: { lat: 11.0304, lng: 77.043 },
    sports: ["Athletics", "Cricket", "Basketball"],
    hours: "9:00 AM - 8:00 PM",
    phone: "+91 9876543210",
    website: "https://kovaisportsacademy.com",
    description: "A premier sports training facility offering coaching in multiple sports disciplines.",
    amenities: ["Indoor courts", "Outdoor tracks", "Gym", "Swimming pool"],
    coaches: [
      { name: "Rajesh Kumar", specialization: "Sprint Coach", experience: "15 years" },
      { name: "Priya Singh", specialization: "Basketball Coach", experience: "10 years" },
    ],
    images: ["/academy-images/kovai1.jpg", "/academy-images/kovai2.jpg"],
  },
  {
    id: 2,
    name: "National Sports Academy",
    address: "MG Road, New Delhi, Delhi 110001",
    rating: 4.7,
    reviews: 48,
    type: "Sports academy",
    location: { lat: 28.6139, lng: 77.209 },
    sports: ["Athletics", "Swimming", "Tennis"],
    hours: "8:00 AM - 9:00 PM",
    phone: "+91 9876543211",
    website: "https://nationalsportsacademy.com",
    description: "Government-backed sports academy with world-class facilities.",
    amenities: ["Olympic-size pool", "Tennis courts", "Athletic track", "Fitness center"],
    coaches: [
      { name: "Vikram Batra", specialization: "Swimming Coach", experience: "20 years" },
      { name: "Anita Sharma", specialization: "Tennis Coach", experience: "12 years" },
    ],
    images: ["/academy-images/nsa1.jpg", "/academy-images/nsa2.jpg"],
  },
  {
    id: 3,
    name: "Chennai Sports Hub",
    address: "Anna Salai, Chennai, Tamil Nadu 600002",
    rating: 4.5,
    reviews: 27,
    type: "Sports center",
    location: { lat: 13.0827, lng: 80.2707 },
    sports: ["Cricket", "Badminton", "Table Tennis"],
    hours: "7:00 AM - 10:00 PM",
    phone: "+91 9876543212",
    website: "https://chennaisportshub.com",
    description: "Modern sports facility in the heart of Chennai.",
    amenities: ["Indoor stadium", "Badminton courts", "Cricket nets", "Cafeteria"],
    coaches: [
      { name: "Ravi Chandran", specialization: "Cricket Coach", experience: "18 years" },
      { name: "Meena Kumari", specialization: "Badminton Coach", experience: "8 years" },
    ],
    images: ["/academy-images/csh1.jpg", "/academy-images/csh2.jpg"],
  },
  {
    id: 4,
    name: "Jaipur Athletics Academy",
    address: "Tonk Road, Jaipur, Rajasthan 302015",
    rating: 4.3,
    reviews: 19,
    type: "Athletics academy",
    location: { lat: 26.9124, lng: 75.7873 },
    sports: ["Athletics", "Long Jump", "Javelin Throw"],
    hours: "6:00 AM - 7:00 PM",
    phone: "+91 9876543213",
    website: "https://jaipurathleticsacademy.com",
    description: "Specialized academy for track and field events.",
    amenities: ["400m track", "Field events area", "Gym", "Physiotherapy center"],
    coaches: [
      { name: "Mahendra Singh", specialization: "Sprint Coach", experience: "14 years" },
      { name: "Sunita Devi", specialization: "Javelin Coach", experience: "9 years" },
    ],
    images: ["/academy-images/jaa1.jpg", "/academy-images/jaa2.jpg"],
  },
  {
    id: 5,
    name: "Bangalore Cricket Institute",
    address: "MG Road, Bangalore, Karnataka 560001",
    rating: 4.8,
    reviews: 56,
    type: "Cricket academy",
    location: { lat: 12.9716, lng: 77.5946 },
    sports: ["Cricket"],
    hours: "8:30 AM - 8:30 PM",
    phone: "+91 9876543214",
    website: "https://bangalorecricketinstitute.com",
    description: "Premier cricket training institute with state-of-the-art facilities.",
    amenities: ["Cricket nets", "Bowling machines", "Video analysis", "Fitness center"],
    coaches: [
      { name: "Anil Kumar", specialization: "Batting Coach", experience: "22 years" },
      { name: "Rahul Sharma", specialization: "Bowling Coach", experience: "16 years" },
    ],
    images: ["/academy-images/bci1.jpg", "/academy-images/bci2.jpg"],
  },
  {
    id: 6,
    name: "Lucknow Gymnastics Center",
    address: "Hazratganj, Lucknow, Uttar Pradesh 226001",
    rating: 4.6,
    reviews: 31,
    type: "Gymnastics center",
    location: { lat: 26.8467, lng: 80.9462 },
    sports: ["Gymnastics", "Aerobics"],
    hours: "9:00 AM - 7:00 PM",
    phone: "+91 9876543215",
    website: "https://lucknowgymnasticscenter.com",
    description: "Specialized center for gymnastics training.",
    amenities: ["Gymnastics equipment", "Foam pit", "Training area", "Locker rooms"],
    coaches: [
      { name: "Deepika Kumari", specialization: "Artistic Gymnastics", experience: "17 years" },
      { name: "Rajat Verma", specialization: "Rhythmic Gymnastics", experience: "11 years" },
    ],
    images: ["/academy-images/lgc1.jpg", "/academy-images/lgc2.jpg"],
  },
  {
    id: 7,
    name: "Mumbai Swimming Academy",
    address: "Marine Drive, Mumbai, Maharashtra 400020",
    rating: 4.4,
    reviews: 42,
    type: "Swimming academy",
    location: { lat: 18.9442, lng: 72.8234 },
    sports: ["Swimming", "Diving", "Water Polo"],
    hours: "6:00 AM - 9:00 PM",
    phone: "+91 9876543216",
    website: "https://mumbaiswimmingacademy.com",
    description: "Comprehensive swimming training facility near the Arabian Sea.",
    amenities: ["Olympic-size pool", "Diving boards", "Training pool", "Sauna"],
    coaches: [
      { name: "Sanjay Patel", specialization: "Swimming Coach", experience: "19 years" },
      { name: "Neha Gupta", specialization: "Diving Coach", experience: "13 years" },
    ],
    images: ["/academy-images/msa1.jpg", "/academy-images/msa2.jpg"],
  },
  {
    id: 8,
    name: "Kolkata Football School",
    address: "Salt Lake, Kolkata, West Bengal 700098",
    rating: 4.5,
    reviews: 38,
    type: "Football academy",
    location: { lat: 22.5726, lng: 88.3639 },
    sports: ["Football"],
    hours: "7:00 AM - 8:00 PM",
    phone: "+91 9876543217",
    website: "https://kolkatafootballschool.com",
    description: "Dedicated football training academy with international standard facilities.",
    amenities: ["Football fields", "Indoor training area", "Fitness center", "Video analysis room"],
    coaches: [
      { name: "Subrata Paul", specialization: "Goalkeeping Coach", experience: "15 years" },
      { name: "Bhaichung Bhutia", specialization: "Striking Coach", experience: "20 years" },
    ],
    images: ["/academy-images/kfs1.jpg", "/academy-images/kfs2.jpg"],
  },
  {
    id: 9,
    name: "Hyderabad Tennis Village",
    address: "Gachibowli, Hyderabad, Telangana 500032",
    rating: 4.7,
    reviews: 29,
    type: "Tennis academy",
    location: { lat: 17.4399, lng: 78.3489 },
    sports: ["Tennis"],
    hours: "6:30 AM - 9:30 PM",
    phone: "+91 9876543218",
    website: "https://hyderabadtennisvillage.com",
    description: "Premium tennis training facility with clay and hard courts.",
    amenities: ["Clay courts", "Hard courts", "Gym", "Pro shop"],
    coaches: [
      { name: "Leander Paes", specialization: "Doubles Coach", experience: "25 years" },
      { name: "Sania Mirza", specialization: "Singles Coach", experience: "15 years" },
    ],
    images: ["/academy-images/htv1.jpg", "/academy-images/htv2.jpg"],
  },
  {
    id: 10,
    name: "Guwahati Boxing Club",
    address: "Paltan Bazaar, Guwahati, Assam 781001",
    rating: 4.2,
    reviews: 21,
    type: "Boxing club",
    location: { lat: 26.1445, lng: 91.7362 },
    sports: ["Boxing"],
    hours: "7:00 AM - 8:00 PM",
    phone: "+91 9876543219",
    website: "https://guwahatiboxingclub.com",
    description: "Specialized boxing training facility in Northeast India.",
    amenities: ["Boxing rings", "Punching bags", "Sparring area", "Fitness equipment"],
    coaches: [
      { name: "Mary Kom", specialization: "Women's Boxing", experience: "20 years" },
      { name: "Vijender Singh", specialization: "Men's Boxing", experience: "18 years" },
    ],
    images: ["/academy-images/gbc1.jpg", "/academy-images/gbc2.jpg"],
  },
]

// Get all academies with optional filtering
export const getAcademies = async (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredAcademies = [...academiesData]

      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredAcademies = filteredAcademies.filter(
          (academy) =>
            academy.name.toLowerCase().includes(searchTerm) ||
            academy.address.toLowerCase().includes(searchTerm) ||
            academy.sports.some((sport) => sport.toLowerCase().includes(searchTerm)),
        )
      }

      // Apply sport filter
      if (filters.sport && filters.sport !== "All") {
        filteredAcademies = filteredAcademies.filter((academy) => academy.sports.includes(filters.sport))
      }

      // Apply rating filter
      if (filters.minRating) {
        filteredAcademies = filteredAcademies.filter((academy) => academy.rating >= filters.minRating)
      }

      // Sort by rating if requested
      if (filters.sortBy === "rating") {
        filteredAcademies.sort((a, b) => b.rating - a.rating)
      }

      // Sort by distance if requested (mock implementation)
      if (filters.sortBy === "distance" && filters.userLocation) {
        // In a real app, you would calculate actual distances
        // This is just a mock implementation
        filteredAcademies.sort((a, b) => {
          const distA = calculateDistance(filters.userLocation, a.location)
          const distB = calculateDistance(filters.userLocation, b.location)
          return distA - distB
        })
      }

      resolve(filteredAcademies)
    }, 300) // Simulate network delay
  })
}

// Get academy by ID
export const getAcademyById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const academy = academiesData.find((a) => a.id === Number.parseInt(id))
      if (academy) {
        resolve(academy)
      } else {
        reject(new Error("Academy not found"))
      }
    }, 200)
  })
}

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(point1, point2) {
  const R = 6371 // Radius of the Earth in km
  const dLat = deg2rad(point2.lat - point1.lat)
  const dLon = deg2rad(point2.lng - point1.lng)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(point1.lat)) * Math.cos(deg2rad(point2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

// Get all available sports
export const getAvailableSports = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sports = new Set()
      academiesData.forEach((academy) => {
        academy.sports.forEach((sport) => sports.add(sport))
      })
      resolve(["All", ...Array.from(sports)])
    }, 100)
  })
}

// Get nearby academies based on user location
export const getNearbyAcademies = async (userLocation, radius = 50) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nearbyAcademies = academiesData.filter((academy) => {
        const distance = calculateDistance(userLocation, academy.location)
        return distance <= radius
      })

      // Sort by distance
      nearbyAcademies.sort((a, b) => {
        const distA = calculateDistance(userLocation, a.location)
        const distB = calculateDistance(userLocation, b.location)
        return distA - distB
      })

      resolve(nearbyAcademies)
    }, 300)
  })
}
