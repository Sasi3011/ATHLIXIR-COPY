"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Sidebar from "../components/Sidebar"
import DocumentUploadModal from "../components/DocumentUploadModal"
import { getAthleteProfile } from "../api/athletes"
import { getPerformanceData, uploadMedicalDocument } from "../api/performance"
// Import the PageHeader component
import PageHeader from "../components/PageHeader"

const PerformancePage = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [athleteData, setAthleteData] = useState(null)
  const [performanceData, setPerformanceData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [activeTab, setActiveTab] = useState("performance")

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser && currentUser.email) {
          const athleteProfile = await getAthleteProfile(currentUser.email)
          setAthleteData(athleteProfile)

          const performance = await getPerformanceData(currentUser.email)
          setPerformanceData(performance)
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

  const handleUploadDocument = async (documentData) => {
    try {
      setLoading(true)
      await uploadMedicalDocument(currentUser.email, documentData)
      setShowUploadModal(false)
      // Refresh performance data
      const performance = await getPerformanceData(currentUser.email)
      setPerformanceData(performance)
    } catch (error) {
      console.error("Error uploading document:", error)
      setError("Failed to upload document")
    } finally {
      setLoading(false)
    }
  }

  const handleViewAnalytics = () => {
    navigate("/analytics")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="performance" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <PageHeader title="Performance" athleteData={athleteData} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "performance"
                    ? "border-yellow-400 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("performance")}
              >
                Performance Reports
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "medical"
                    ? "border-yellow-400 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("medical")}
              >
                Medical Reports
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "training"
                    ? "border-yellow-400 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("training")}
              >
                Training Schedule
              </button>
            </div>
          </div>

          {activeTab === "performance" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Performance Reports */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Performance Reports</h2>
                    <button
                      onClick={handleViewAnalytics}
                      className="text-sm text-yellow-500 hover:text-yellow-600 font-medium"
                    >
                      View All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sprint Performance */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Sprint Performance</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-medium">55%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "55%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>8/15 tasks completed</span>
                      </div>
                    </div>

                    {/* Match Analysis */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Match Analysis</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-medium">30%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>8/40 metrics analyzed</span>
                      </div>
                    </div>

                    {/* Coach Feedback */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Coach Feedback</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                      </div>
                      <div className="mb-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-medium">89%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "89%" }}></div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>40/55 feedback items addressed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Analytics</h2>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Weekly</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="h-64 relative">
                    {/* Performance Chart */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>100%</span>
                          <span>70%</span>
                          <span>50%</span>
                          <span>30%</span>
                          <span>0%</span>
                        </div>
                        <div className="relative h-48 w-full">
                          {/* Chart SVG */}
                          <svg viewBox="0 0 700 200" className="w-full h-full">
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.1" />
                              </linearGradient>
                            </defs>
                            <path
                              d="M0,180 C50,120 100,160 150,100 C200,40 250,80 300,120 C350,160 400,40 450,20 C500,0 550,60 600,100 C650,140 700,180 700,180 L700,200 L0,200 Z"
                              fill="url(#gradient)"
                            />
                            <path
                              d="M0,180 C50,120 100,160 150,100 C200,40 250,80 300,120 C350,160 400,40 450,20 C500,0 550,60 600,100 C650,140 700,180 700,180"
                              fill="none"
                              stroke="#FBBF24"
                              strokeWidth="3"
                            />
                            {/* Data point with tooltip */}
                            <g transform="translate(450, 20)">
                              <circle cx="0" cy="0" r="6" fill="#FBBF24" />
                              <foreignObject x="-75" y="-70" width="150" height="60">
                                <div
                                  xmlns="http://www.w3.org/1999/xhtml"
                                  className="bg-gray-800 text-white p-2 rounded text-xs"
                                >
                                  <p className="font-bold">5 tasks</p>
                                  <p>Almost completed</p>
                                </div>
                              </foreignObject>
                            </g>
                          </svg>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Sun</span>
                          <span>Mon</span>
                          <span>Tue</span>
                          <span>Wed</span>
                          <span>Thu</span>
                          <span>Fri</span>
                          <span>Sat</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Training Schedule */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-7">
                    <h2 className="text-lg font-semibold">Training Schedule</h2>
                    <button className="text-sm text-yellow-500 hover:text-yellow-600 font-medium">See All</button>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="flex-shrink-0 mr-3">
                        <input type="checkbox" className="h-5 w-5 text-yellow-400 rounded" checked readOnly />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Sprint drills & strength training</h3>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mr-3">
                        <input type="checkbox" className="h-5 w-5 text-yellow-400 rounded" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Recovery Exercises for injured athletes</h3>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mr-3">
                        <input type="checkbox" className="h-5 w-5 text-yellow-400 rounded" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Recovery Exercises for injured athletes</h3>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Training Summary */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Training Summary</h2>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-yellow-400 p-4 rounded-lg text-center">
                      <div className="flex justify-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-white font-bold text-2xl">40</h3>
                      <p className="text-white text-sm">Win</p>
                    </div>

                    <div className="bg-blue-400 p-4 rounded-lg text-center">
                      <div className="flex justify-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-white font-bold text-2xl">79</h3>
                      <p className="text-white text-sm">Loss</p>
                    </div>

                    <div className="bg-white border border-gray-200 p-4 rounded-lg text-center">
                      <div className="flex justify-center mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-gray-800 font-bold text-2xl">89</h3>
                      <p className="text-gray-500 text-sm">Attempt</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Training Consistency Rate (%)</h3>
                      <div className="flex items-center">
                        <span className="text-green-500 text-sm font-medium">+2.5%</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">95%</div>
                    <div className="mt-2">
                      <svg viewBox="0 0 100 20" className="w-full">
                        <path
                          d="M0,10 L10,12 L20,8 L30,14 L40,6 L50,10 L60,7 L70,15 L80,9 L90,12 L100,5"
                          fill="none"
                          stroke="#FBBF24"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Reports & Downloads */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-6">Reports & Downloads</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition duration-150">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-green-600 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Performance Report</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition duration-150">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-red-600 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span>Medical & Injury Report</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition duration-150">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-yellow-500 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                          />
                        </svg>
                        <span>Export Analytics</span>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Medical Reports */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-6">Medical Reports</h2>

                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-md transition duration-200 mb-4"
                  >
                    Upload Medical report
                  </button>

                  <button className="w-full py-3 px-4 bg-white border border-yellow-400 hover:bg-yellow-50 text-yellow-500 font-semibold rounded-md transition duration-200">
                    Sponsorship & Scholarship Finder
                  </button>
                </div>

                {/* Leaderboard */}
                {/* <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Leaderboard</h2>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-md">
                      <div className="flex items-center">
                        <span className="w-6 text-center font-semibold">1</span>
                        <span className="ml-4">Amlan Borgohain</span>
                      </div>
                      <span className="font-medium">10.25s</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md">
                      <div className="flex items-center">
                        <span className="w-6 text-center font-semibold">2</span>
                        <span className="ml-4">Suresh Sathya</span>
                      </div>
                      <span className="font-medium">10.30s</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md">
                      <div className="flex items-center">
                        <span className="w-6 text-center font-semibold">3</span>
                        <span className="ml-4">Muhammed Anas Yahiya</span>
                      </div>
                      <span className="font-medium">10.36s</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md">
                      <div className="flex items-center">
                        <span className="w-6 text-center font-semibold">4</span>
                        <span className="ml-4">Dutee Chand</span>
                      </div>
                      <span className="font-medium">11.22s</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md">
                      <div className="flex items-center">
                        <span className="w-6 text-center font-semibold">5</span>
                        <span className="ml-4">Srabani Nanda</span>
                      </div>
                      <span className="font-medium">11.45s</span>
                    </div>
                    <div className="flex items-center justify-between bg-yellow-50 p-2 rounded-md">
                      <div className="flex items-center">
                        <span className="w-6 text-center font-semibold">20</span>
                        <span className="ml-4">{athleteData?.fullName || "You"}</span>
                      </div>
                      <span className="font-medium">12.74s</span>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          )}

          {activeTab === "medical" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Medical Requirements</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder={athleteData?.fullName || ""}
                  />
                </div>

                <div>
                  <label htmlFor="dateOfIssue" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of issue
                  </label>
                  <div className="relative">
                    <input
                      id="dateOfIssue"
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <div className="relative">
                    <select
                      id="bloodGroup"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      id="gender"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                      defaultValue={athleteData?.gender || ""}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-1">
                  Hospital Name
                </label>
                <input
                  id="hospitalName"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter hospital name"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="medicalCertificate" className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Certificate
                </label>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center justify-center w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-md transition duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Upload Document
                </button>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-yellow-400 rounded" />
                  <span className="ml-2 text-sm text-gray-600">
                    I confirm the information is accurate and agree to the Terms & Conditions. I authorize AI-based
                    verification of my uploaded medical documents for validation and fraud detection.
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition duration-200">
                  Clear Form
                </button>
                <button className="py-2 px-4 bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded-md transition duration-200">
                  Submit
                </button>
              </div>
            </div>
          )}

          {activeTab === "training" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-6">Training Schedule</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Day
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Time
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Activity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Coach
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Monday</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6:00 AM - 8:00 AM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sprint drills & strength</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Coach Rajesh</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tuesday</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4:00 PM - 6:00 PM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Endurance training</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Coach Priya</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Wednesday</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6:00 AM - 8:00 AM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Recovery & flexibility</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Coach Rajesh</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          In Progress
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Thursday</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4:00 PM - 6:00 PM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Speed & agility</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Coach Priya</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Upcoming
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Friday</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6:00 AM - 8:00 AM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Technique & form</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Coach Rajesh</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Upcoming
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Saturday</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4:00 PM - 6:00 PM</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Competition simulation</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Coach Priya</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Upcoming
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sunday</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rest day</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Upcoming
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Document Upload Modal */}
      {showUploadModal && (
        <DocumentUploadModal onClose={() => setShowUploadModal(false)} onUpload={handleUploadDocument} />
      )}
    </div>
  )
}

export default PerformancePage
