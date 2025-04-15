"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Sidebar from "../components/Sidebar"
import { getAthleteProfile } from "../api/athletes"
import { getAchievements, addAchievement } from "../api/achievements"
import AchievementCard from "../components/AchievementCard"
import AddAchievementModal from "../components/AddAchievementModal"
import { LayoutGrid, Plus, SlidersHorizontal } from "lucide-react"
// Import the PageHeader component
import PageHeader from "../components/PageHeader"

const AchievementsPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [athleteData, setAthleteData] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("recent")
  const [sortBy, setSortBy] = useState("updated")
  const [showFolders, setShowFolders] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(6)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser && currentUser.email) {
          const athleteProfile = await getAthleteProfile(currentUser.email)
          setAthleteData(athleteProfile)

          const achievementsData = await getAchievements(currentUser.email)
          setAchievements(achievementsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser])

  const handleAddAchievement = async (achievementData) => {
    try {
      setLoading(true)
      const newAchievement = await addAchievement({
        ...achievementData,
        athleteEmail: currentUser.email,
      })

      // Update achievements list with the new achievement
      setAchievements((prevAchievements) => [newAchievement, ...prevAchievements])
      setShowAddModal(false)
    } catch (error) {
      console.error("Error adding achievement:", error)
      setError("Failed to add achievement")
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  const handleSortChange = (sort) => {
    setSortBy(sort)
  }

  const toggleFolders = () => {
    setShowFolders(!showFolders)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Filter achievements based on active tab, search query, etc.
  const filteredAchievements = achievements.filter((achievement) => {
    // Filter by tab
    if (activeTab === "career" && !achievement.isCareerHighlight) return false
    if (activeTab === "personal" && !achievement.isPersonalBest) return false

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        achievement.title.toLowerCase().includes(query) ||
        achievement.event.toLowerCase().includes(query) ||
        achievement.description.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Sort achievements
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sortBy === "updated") {
      return new Date(b.date) - new Date(a.date)
    } else if (sortBy === "title") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "event") {
      return a.event.localeCompare(b.event)
    }
    return 0
  })

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentAchievements = sortedAchievements.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedAchievements.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading && achievements.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="achievements" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <PageHeader title="Achievements" athleteData={athleteData} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {/* Tabs and filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex space-x-6 border-b border-gray-200 w-full sm:w-auto">
              <button
                className={`py-2 px-1 ${
                  activeTab === "recent"
                    ? "text-yellow-500 border-b-2 border-yellow-500 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabChange("recent")}
              >
                Recent
              </button>
              <button
                className={`py-2 px-1 ${
                  activeTab === "career"
                    ? "text-yellow-500 border-b-2 border-yellow-500 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabChange("career")}
              >
                Career Highlights
              </button>
              <button
                className={`py-2 px-1 ${
                  activeTab === "personal"
                    ? "text-yellow-500 border-b-2 border-yellow-500 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabChange("personal")}
              >
                Personal Bests
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="text-sm border-none bg-transparent focus:outline-none text-gray-700 font-medium"
                >
                  <option value="updated">Updated</option>
                  <option value="title">Title</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <button className="flex items-center space-x-2 text-sm text-gray-700" onClick={toggleFolders}>
                <LayoutGrid className="h-5 w-5 text-gray-500" />
                <span>Folders: {showFolders ? "Show" : "Hide"}</span>
              </button>
            </div>
          </div>

          {/* Achievements grid */}
          {currentAchievements.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? "No achievements match your search criteria" : "You haven't added any achievements yet"}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded-md"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Achievement
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentAchievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Previous
                    </button>

                    {[...Array(totalPages).keys()].map((number) => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === number + 1
                            ? "bg-yellow-400 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}

          {/* Add achievement button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="fixed bottom-8 right-8 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
          >
            <Plus className="h-6 w-6" />
            <span className="ml-2 font-medium">New</span>
          </button>
        </main>
      </div>

      {/* Add Achievement Modal */}
      {showAddModal && <AddAchievementModal onClose={() => setShowAddModal(false)} onSubmit={handleAddAchievement} />}
    </div>
  )
}

export default AchievementsPage
