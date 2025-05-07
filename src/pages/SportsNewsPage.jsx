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
import {
  getAllSportsNews,
  getNewsByCategory,
  getTrendingNews,
  searchNews,
  getFallbackNewsData,
} from "../api/sportsNews"

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

      setNewsArticles(response.articles || [])
      setTotalPages(Math.ceil((response.totalResults || 0) / 10))

      // Fetch trending news only on first load or category change
      if (currentPage === 1) {
        const trendingResponse = await getTrendingNews()

        // Transform the trending news data to match our component structure
        const transformedTrending =
          trendingResponse.articles?.slice(0, 5).map((article) => ({
            tag: `#${article.source.name.split(" ")[0]}`,
            date: new Date(article.publishedAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            title: article.title,
            image: article.urlToImage,
          })) || []

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
                <>
                  {/* Featured News Articles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {newsArticles.slice(0, 2).map((article, index) => (
                      <NewsCard key={index} article={article} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex justify-center mb-8">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 text-gray-700 mr-2 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 text-white disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Additional News Articles */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {newsArticles.slice(2, 5).map((article, index) => (
                      <div key={index} className="border-t pt-4">
                        <div className="text-sm text-gray-500 mb-2">
                          {new Date(article.publishedAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar Content */}
            <div>
              {/* Search Form (Desktop) */}
              <form onSubmit={handleSearch} className="mb-8 hidden lg:block">
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

              {/* Categories */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Category</h3>
                  <div className="flex">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
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

              {/* Trending News */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Trending News</h3>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 rounded-md mr-3"></div>
                        <div className="flex-1">
                          <div className="bg-gray-200 h-3 w-1/2 mb-2"></div>
                          <div className="bg-gray-200 h-4 w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {trendingNews.map((item, index) => (
                      <TrendingNewsItem key={index} item={item} />
                    ))}

                    <button className="w-full py-2 bg-yellow-400 text-yellow-800 font-medium rounded-lg flex items-center justify-center mt-4 hover:bg-yellow-500 transition-colors">
                      More <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </>
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
