"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Sidebar from "../components/Sidebar"
import { getAthleteProfile } from "../api/athletes"
import { getPerformanceData, getMedicalDocuments, uploadMedicalDocument } from "../api/performance"
import DocumentUploadModal from "../components/DocumentUploadModal"

const AnalyticsPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [athleteData, setAthleteData] = useState(null)
  const [performanceData, setPerformanceData] = useState(null)
  const [medicalDocuments, setMedicalDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showUploadModal, setShowUploadModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser && currentUser.email) {
          const athleteProfile = await getAthleteProfile(currentUser.email)
          setAthleteData(athleteProfile)

          const performance = await getPerformanceData(currentUser.email)
          setPerformanceData(performance)

          const documents = await getMedicalDocuments(currentUser.email)
          setMedicalDocuments(documents)
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

      // Refresh medical documents
      const documents = await getMedicalDocuments(currentUser.email)
      setMedicalDocuments(documents)
    } catch (error) {
      console.error("Error uploading document:", error)
      setError("Failed to upload document")
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadDocument = (documentId) => {
    // In a real application, this would trigger a download of the document
    console.log(`Downloading document with ID: ${documentId}`)
    alert("Document download started")
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
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-800">Report Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div className="relative">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                  <span className="sr-only">Notifications</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src={`https://ui-avatars.com/api/?name=${athleteData?.fullName || "User"}&background=FFD700&color=fff`}
                    alt="Profile"
                    className="h-10 w-10 rounded-full border-2 border-yellow-400"
                  />
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">{athleteData?.fullName || "Athlete"}</span>
                  <span className="text-xs text-gray-500">{athleteData?.sportsCategory || "Athlete"}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {/* Medical Analytics */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6 text-yellow-500">Medical Analytics</h2>

            <div className="h-96 relative mb-6">
              {/* Medical Analytics Chart */}
              <svg viewBox="0 0 1500 700" className="w-full h-full">
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {/* Y-axis labels */}
                <text x="30" y="50" fontSize="12" fill="#888">
                  1500
                </text>
                <text x="30" y="100" fontSize="12" fill="#888">
                  1400
                </text>
                <text x="30" y="150" fontSize="12" fill="#888">
                  1300
                </text>
                <text x="30" y="200" fontSize="12" fill="#888">
                  1200
                </text>
                <text x="30" y="250" fontSize="12" fill="#888">
                  1100
                </text>
                <text x="30" y="300" fontSize="12" fill="#888">
                  1000
                </text>
                <text x="30" y="350" fontSize="12" fill="#888">
                  900
                </text>
                <text x="30" y="400" fontSize="12" fill="#888">
                  800
                </text>
                <text x="30" y="450" fontSize="12" fill="#888">
                  700
                </text>
                <text x="30" y="500" fontSize="12" fill="#888">
                  600
                </text>
                <text x="30" y="550" fontSize="12" fill="#888">
                  500
                </text>
                <text x="30" y="600" fontSize="12" fill="#888">
                  400
                </text>
                <text x="30" y="650" fontSize="12" fill="#888">
                  300
                </text>

                {/* X-axis labels */}
                <text x="100" y="680" fontSize="12" fill="#888">
                  Jan'24
                </text>
                <text x="200" y="680" fontSize="12" fill="#888">
                  Feb'24
                </text>
                <text x="300" y="680" fontSize="12" fill="#888">
                  Mar'24
                </text>
                <text x="400" y="680" fontSize="12" fill="#888">
                  Apr'24
                </text>
                <text x="500" y="680" fontSize="12" fill="#888">
                  May'24
                </text>
                <text x="600" y="680" fontSize="12" fill="#888">
                  Jun'24
                </text>
                <text x="700" y="680" fontSize="12" fill="#888">
                  Jul'24
                </text>
                <text x="800" y="680" fontSize="12" fill="#888">
                  Aug'24
                </text>
                <text x="900" y="680" fontSize="12" fill="#888">
                  Sep'24
                </text>
                <text x="1000" y="680" fontSize="12" fill="#888">
                  Oct'24
                </text>
                <text x="1100" y="680" fontSize="12" fill="#888">
                  Nov'24
                </text>
                <text x="1200" y="680" fontSize="12" fill="#888">
                  Dec'24
                </text>
                <text x="1300" y="680" fontSize="12" fill="#888">
                  Jan'25
                </text>
                <text x="1400" y="680" fontSize="12" fill="#888">
                  Feb'25
                </text>

                {/* Chart line */}
                <path
                  d="M100,650 C120,630 140,640 160,620 C180,600 200,610 220,600 C240,590 260,600 280,580 C300,560 320,550 340,540 C360,530 380,520 400,510 C420,500 440,490 460,350 C480,200 500,450 520,400 C540,350 560,300 580,250 C600,200 620,150 640,200 C660,250 680,300 700,150 C720,100 740,50 760,100 C780,150 800,200 820,250 C840,300 860,350 880,300 C900,250 920,200 940,250 C960,300 980,350 1000,300 C1020,250 1040,200 1060,250 C1080,300 1100,350 1120,300 C1140,250 1160,200 1180,250 C1200,300 1220,350 1240,400 C1260,450 1280,500 1300,450 C1320,400 1340,350 1360,400 C1380,450 1400,500 1420,450"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="3"
                />

                {/* Area under the line */}
                <path
                  d="M100,650 C120,630 140,640 160,620 C180,600 200,610 220,600 C240,590 260,600 280,580 C300,560 320,550 340,540 C360,530 380,520 400,510 C420,500 440,490 460,350 C480,200 500,450 520,400 C540,350 560,300 580,250 C600,200 620,150 640,200 C660,250 680,300 700,150 C720,100 740,50 760,100 C780,150 800,200 820,250 C840,300 860,350 880,300 C900,250 920,200 940,250 C960,300 980,350 1000,300 C1020,250 1040,200 1060,250 C1080,300 1100,350 1120,300 C1140,250 1160,200 1180,250 C1200,300 1220,350 1240,400 C1260,450 1280,500 1300,450 C1320,400 1340,350 1360,400 C1380,450 1400,500 1420,450 L1420,650 L100,650 Z"
                  fill="url(#areaGradient)"
                />
              </svg>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center justify-center py-2 px-4 bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded-md transition duration-200"
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
                Upload New Report
              </button>

              <button className="flex items-center justify-center py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                View Full Report Analytics
              </button>

              <button className="flex items-center justify-center py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download Monthly Summary (PDF)
              </button>

              <button className="flex items-center justify-center py-2 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md transition duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                Filters by date/type/status
              </button>
            </div>
          </div>

          {/* Document Verification Results */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-6">Document Verification Results</h2>

            {medicalDocuments.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600 mb-4">No medical documents uploaded yet</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center justify-center py-2 px-4 bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded-md transition duration-200"
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
                  Upload Medical Document
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {medicalDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-medium">{doc.name}</h3>
                        <p className="text-sm text-gray-500">
                          Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.verified ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Fake Document
                          </span>
                        )}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          Confidence: {doc.confidenceScore}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <img
                            src={doc.imageUrl || "/placeholder.svg?height=300&width=200"}
                            alt="Medical Document"
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="bg-gray-50 p-4 rounded-lg h-full">
                          <h4 className="font-medium mb-2">Verification Results</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Document Type:</span>
                              <span className="text-sm font-medium">{doc.documentType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Issuing Authority:</span>
                              <span className="text-sm font-medium">{doc.issuingAuthority}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Issue Date:</span>
                              <span className="text-sm font-medium">{doc.issueDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Expiry Date:</span>
                              <span className="text-sm font-medium">{doc.expiryDate || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Verification Method:</span>
                              <span className="text-sm font-medium">AI/ML Document Analysis</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Verification Date:</span>
                              <span className="text-sm font-medium">
                                {new Date(doc.verificationDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Verification Notes</h4>
                            <p className="text-sm text-gray-600">{doc.verificationNotes}</p>
                          </div>

                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              onClick={() => handleDownloadDocument(doc.id)}
                              className="inline-flex items-center py-2 px-3 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Performance Insights</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Health Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Heart Rate (Resting)</span>
                      <span className="text-sm font-medium">68 bpm</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Blood Pressure</span>
                      <span className="text-sm font-medium">120/80 mmHg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Oxygen Saturation</span>
                      <span className="text-sm font-medium">98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "98%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Body Fat Percentage</span>
                      <span className="text-sm font-medium">12%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "12%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-4">Fitness Assessment</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">VO2 Max</span>
                      <span className="text-sm font-medium">52 ml/kg/min</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "82%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Sprint Speed</span>
                      <span className="text-sm font-medium">12.74s (100m)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Endurance</span>
                      <span className="text-sm font-medium">Good</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Strength Index</span>
                      <span className="text-sm font-medium">Above Average</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-4">Recommendations Based on Medical Reports</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      <strong>Nutrition:</strong> Increase protein intake to 1.8g per kg of body weight to support
                      muscle recovery and growth.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      <strong>Training:</strong> Incorporate more plyometric exercises to improve explosive power for
                      sprinting.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-500 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      <strong>Recovery:</strong> Monitor mild knee inflammation after high-intensity sessions. Apply ice
                      therapy for 15 minutes post-workout.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      <strong>Sleep:</strong> Current sleep quality is good. Maintain 8-9 hours per night for optimal
                      recovery.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Document Upload Modal */}
      {showUploadModal && (
        <DocumentUploadModal onClose={() => setShowUploadModal(false)} onUpload={handleUploadDocument} />
      )}
    </div>
  )
}

export default AnalyticsPage
