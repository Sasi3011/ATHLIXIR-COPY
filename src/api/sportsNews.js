import axios from "axios"

// Access API URL and Key from environment variables
const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
const BASE_URL = process.env.REACT_APP_API_URL;

// Get all sports news
export const getAllSportsNews = async (page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: "sports",
        language: "en",
        sortBy: "publishedAt",
        apiKey: API_KEY,
        page,
        pageSize,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching sports news:", error)
    throw error
  }
}

// Get news by sport category
export const getNewsByCategory = async (category, page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: category,
        language: "en",
        sortBy: "publishedAt",
        apiKey: API_KEY,
        page,
        pageSize,
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error)
    throw error
  }
}

// Get trending news
export const getTrendingNews = async (pageSize = 5) => {
  try {
    const response = await axios.get(`${BASE_URL}/top-headlines`, {
      params: {
        category: "sports",
        language: "en",
        apiKey: API_KEY,
        pageSize,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching trending news:", error)
    throw error
  }
}

// Search news by keyword
export const searchNews = async (query, page = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: query,
        language: "en",
        sortBy: "publishedAt",
        apiKey: API_KEY,
        page,
        pageSize,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error searching news:", error)
    throw error
  }
}

// Fallback data in case API fails or rate limit is reached
export const getFallbackNewsData = () => {
  return {
    articles: [
      {
        source: { id: "espn", name: "ESPN" },
        author: "Jake Willhoite",
        title: "5 Exercises Basketball Players To Develop Strength",
        description:
          "This article was written by Jake Willhoite from Healthlisted.com Strength in basketball isn't all about a massive body mass or ripped muscles.",
        url: "https://example.com/basketball-exercises",
        urlToImage: "https://example.com/images/basketball.jpg",
        publishedAt: "2025-02-27T12:00:00Z",
        content: "Full article content here...",
      },
      {
        source: { id: "nhl", name: "NHL" },
        author: "NHL Staff",
        title: "Golden Knights out to fulfill owner's quest to win",
        description:
          "The Vegas Golden Knights will play the Florida Panthers in the Stanley Cup Final beginning Saturday.",
        url: "https://example.com/golden-knights",
        urlToImage: "https://example.com/images/hockey.jpg",
        publishedAt: "2025-02-25T14:30:00Z",
        content: "Full article content here...",
      },
      {
        source: { id: "cricinfo", name: "ESPN Cricinfo" },
        author: "Cricinfo Staff",
        title: "Never let this feeling creep in that I play only one format for India now",
        description: "Shikhar Dhawan discusses his role in Indian cricket.",
        url: "https://example.com/dhawan-interview",
        urlToImage: "https://example.com/images/dhawan.jpg",
        publishedAt: "2025-02-24T09:15:00Z",
        content: "Full article content here...",
      },
      {
        source: { id: "bcci", name: "BCCI" },
        author: "BCCI Staff",
        title: "Indian pacer Renuka Singh surges to career-best T20 ranking",
        description: "Renuka Singh has reached her career-best ranking in T20 cricket.",
        url: "https://example.com/renuka-singh",
        urlToImage: "https://example.com/images/renuka.jpg",
        publishedAt: "2025-02-15T11:45:00Z",
        content: "Full article content here...",
      },
      {
        source: { id: "athletics", name: "World Athletics" },
        author: "Athletics Reporter",
        title: "Quietly working his way up, Avinash Sable represents the steady rise of Indian athletics",
        description: "Avinash Sable's journey in athletics has been remarkable.",
        url: "https://example.com/avinash-sable",
        urlToImage: "https://example.com/images/sable.jpg",
        publishedAt: "2025-01-30T16:20:00Z",
        content: "Full article content here...",
      },
    ],
    trending: [
      {
        tag: "#Polar",
        date: "12 Jan 2025",
        title: "Baku 2025 Taekwondo Championships",
        image: "https://example.com/images/taekwondo.jpg",
      },
      {
        tag: "#Golf",
        date: "20 Feb 2025",
        title: "Open Championship Royal Liverpool Golf",
        image: "https://example.com/images/golf.jpg",
      },
      {
        tag: "#Cricket",
        date: "27 Feb 2025",
        title: "Ireland Tour of England Test 2025",
        image: "https://example.com/images/cricket.jpg",
      },
    ],
  }
}
