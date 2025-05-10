"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ClubIcon as Football,
  ClubIcon as CricketIcon,
  ClubIcon as BasketballIcon,
  Users,
  ClubIcon as HockeyIcon,
  MonitorIcon as Running,
} from "lucide-react"
import PageHeader from "../components/PageHeader"
import Sidebar from "../components/Sidebar"
import NewsCard from "../components/NewsCard"
import TrendingNewsItem from "../components/TrendingNewsItem"
import CategoryItem from "../components/CategoryItem"
import { getAllSportsNews, getNewsByCategory, getTrendingNews, searchNews, getFallbackNewsData } from "../api/sportsNews"

const SportsNewsPage = () => {
  // Existing state
  const [newsArticles, setNewsArticles] = useState([])
  const [trendingNews, setTrendingNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const categories = [
    { name: "Football", icon: <Football className="w-5 h-5 text-yellow-600" /> },
    { name: "Cricket", icon: <CricketIcon className="w-5 h-5 text-yellow-600" /> },
    { name: "Basketball", icon: <BasketballIcon className="w-5 h-5 text-yellow-600" /> },
    { name: "Kabaddi", icon: <Users className="w-5 h-5 text-yellow-600" /> },
    { name: "Hockey", icon: <HockeyIcon className="w-5 h-5 text-yellow-600" /> },
    { name: "Kho - Kho", icon: <Running className="w-5 h-5 text-yellow-600" /> },
  ]

  const fetchNews = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let response

      if (searchQuery) {
        response = await searchNews(searchQuery, currentPage)
      } else if (activeCategory === "All") {
        response = await getAllSportsNews(currentPage)
      } else {
        response = await getNewsByCategory(activeCategory, currentPage)
      }

      // Check if we have valid articles data - GNews API format
      if (response && response.articles && Array.isArray(response.articles)) {
        // Make sure each article has valid data - transform GNews format to our format
        const processedArticles = response.articles.map(article => ({
          title: article.title || 'Sports News',
          urlToImage: article.image || 'https://placehold.co/600x400/gray/white?text=Sports+News',
          source: { name: article.source?.name || 'Sports' },
          publishedAt: article.publishedAt || new Date().toISOString(),
          description: article.description || '',
          content: article.content || '',
          url: article.url || '#'
        }))
        setNewsArticles(processedArticles)
        setTotalPages(Math.ceil((response.totalArticles || processedArticles.length) / 10))
      } else if (response && Array.isArray(response)) {
        // Handle case where response might be an array directly
        const processedArticles = response.map(article => ({
          title: article.title || 'Sports News',
          urlToImage: article.image || article.urlToImage || 'https://placehold.co/600x400/gray/white?text=Sports+News',
          source: { name: article.source?.name || 'Sports' },
          publishedAt: article.publishedAt || new Date().toISOString(),
          description: article.description || '',
          content: article.content || '',
          url: article.url || '#'
        }))
        setNewsArticles(processedArticles)
        setTotalPages(Math.ceil(processedArticles.length / 10))
      } else {
        // Use fallback data from getFallbackNewsData()
        const fallbackData = await getFallbackNewsData()
        setNewsArticles(fallbackData.articles || [])
        setTotalPages(1)
      }

      // Fetch trending news only on first load or category change
      if (currentPage === 1) {
        const trendingResponse = await getTrendingNews()

        // Transform the trending news data to match our component structure
        let transformedTrending = [];
        
        if (trendingResponse && trendingResponse.articles && Array.isArray(trendingResponse.articles)) {
          transformedTrending = trendingResponse.articles.slice(0, 5).map((article) => ({
            tag: `#${article.source && article.source.name ? article.source.name.split(" ")[0] : 'Sports'}`,
            date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }) : new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
            title: article.title || 'Sports News',
            image: article.image || article.urlToImage || 'https://placehold.co/300x200/gray/white?text=Sports+News',
          }));
        } else if (trendingResponse && trendingResponse.trending && Array.isArray(trendingResponse.trending)) {
          // Use fallback data directly if it's in the right format
          transformedTrending = trendingResponse.trending;
        }
        
        // If we still don't have trending news, use fallback
        if (transformedTrending.length === 0) {
          transformedTrending = getFallbackNewsData().trending;
        }

        setTrendingNews(transformedTrending)
      }
    } catch (error) {
      console.error("Error fetching news:", error)
      setError("Failed to load news. Please try again later.")

      // Use fallback data if API fails
      const fallbackData = getFallbackNewsData()
      setNewsArticles(fallbackData.articles)
      setTrendingNews(fallbackData.trending)
    } finally {
      setLoading(false)
    }
  }, [activeCategory, currentPage, searchQuery])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const handleCategoryChange = (category) => {
    setActiveCategory(category)
    setCurrentPage(1)
    setSearchQuery("")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    // Search is triggered by the useEffect when searchQuery changes
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activePage="news-feed" className="h-screen flex-shrink-0" />

      <div className="flex-1 overflow-y-auto">
        {/* Make the header fixed */}
        <div className="sticky top-0 z-10 bg-white shadow-md">
          <PageHeader title="Sports News" />
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main News Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Live Updates</h2>

              {/* Search Form (Mobile) */}
              <form onSubmit={handleSearch} className="mb-6 lg:hidden">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search news..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </form>

              {/* Error Message */}
              {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

              {/* Loading State */}
              {loading ? (
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-56 rounded-lg mb-3"></div>
                      <div className="bg-gray-200 h-4 w-1/4 mb-2"></div>
                      <div className="bg-gray-200 h-6 w-3/4 mb-2"></div>
                      <div className="bg-gray-200 h-4 w-full mb-1"></div>
                      <div className="bg-gray-200 h-4 w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {newsArticles.map((article, index) => (
                    <div key={index} className="relative">
                      {article.isToday && (
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg z-10">
                          Current News
                        </div>
                      )}
                      {article.isRecent && !article.isToday && (
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg z-10">
                          Recent
                        </div>
                      )}
                      <NewsCard article={article} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Content - Takes 1/3 of space on desktop */}
            <div className="order-1 md:order-2">
              {/* Desktop Search Form */}
              <form onSubmit={handleSearch} className="mb-6 hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search news..."
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </form>

              {/* Desktop Categories */}
              <div className="mb-6 hidden md:block">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Category</h3>
                </div>

                <div className="space-y-1">
                  <CategoryItem
                    category="All"
                    icon={<BasketballIcon className="w-5 h-5 text-yellow-600" />}
                    isActive={activeCategory === "All"}
                    onClick={handleCategoryChange}
                  />

                  {categories.map((category) => (
                    <CategoryItem
                      key={category.name}
                      category={category.name}
                      icon={category.icon}
                      isActive={activeCategory === category.name}
                      onClick={handleCategoryChange}
                    />
                  ))}
                </div>
              </div>

              {/* Trending News - Mobile & Desktop */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold mb-4">Trending News</h3>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center animate-pulse">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-md mr-3 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="bg-gray-200 h-3 w-1/2 mb-2"></div>
                          <div className="bg-gray-200 h-4 w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {trendingNews.map((item, index) => (
                      <TrendingNewsItem key={index} item={item} />
                    ))}

                    <button className="w-full py-2 bg-yellow-400 text-yellow-800 text-sm font-medium rounded-lg flex items-center justify-center mt-4 hover:bg-yellow-500 transition-colors">
                      More <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SportsNewsPage
