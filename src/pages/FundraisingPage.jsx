"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

const FundraisingPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Sample fundraising data
  const fundraisingData = [
    {
      id: 1,
      trustName: "Kutraleeshwaran Sports Foundation (KSF)",
      website: "kutraleeshwaransportsfoundation.org",
      email: "sports@gmail.com",
      phone: "Not Provided",
    },
    {
      id: 2,
      trustName: "Athletes Sports India Federation (ASIF)",
      website: "sportsindiafederation.com",
      email: "sportsindia@gmail.com",
      phone: "Not Provided",
    },
    {
      id: 3,
      trustName: "GoSports Foundation",
      website: "gosports.in",
      email: "Not Provided",
      phone: "Not Provided",
    },
    {
      id: 4,
      trustName: "Saanjha",
      website: "saanjha.org",
      email: "Not Provided",
      phone: "Not Provided",
    },
    {
      id: 5,
      trustName: "FundRace",
      website: "fundrace.net",
      email: "Not Provided",
      phone: "Not Provided",
    },
    {
      id: 6,
      trustName: "Rural Sports Foundation",
      website: "ruralsportsfoundation.in",
      email: "play@ruralsportsfoundation.in",
      phone: "+91 9953912113",
    },
    {
      id: 7,
      trustName: "Tata Trusts – Spectrum Grants",
      website: "tatatrusts.org/our-work/individual-grants",
      email: "igpedu@tatatrusts.org",
      phone: "Not Provided",
    },
    {
      id: 8,
      trustName: "Sports Coaching Foundation",
      website: "scfindia.org",
      email: "scf_india@yahoo.co.in",
      phone: "+91 9396559440",
    },
    {
      id: 9,
      trustName: "Athletes Sports India Federation (ASIF)",
      website: "sportsindiafederation.com",
      email: "sportsindia.asif@gmail.com",
      phone: "+91 9599313509",
    },
    {
      id: 10,
      trustName: "Abhina Charitable Trust",
      website: "abhina.org/sports.html",
      email: "support@abhina.org",
      phone: "Not Provided",
    },
    {
      id: 11,
      trustName: "Youth Sport Trust ",
      website: "https://trust-registration.in/youthsporttrust.phpr ",
      email: "info@trust-registration.in",
      phone: " +91-9766622693",
    },
  ]

  // Handle website click - open in new tab
  const handleWebsiteClick = (website) => {
    window.open(`https://${website}`, "_blank", "noopener,noreferrer")
  }

  // Pagination controls
  const totalPages = Math.ceil(fundraisingData.length / rowsPerPage)

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageClick = (page) => {
    setCurrentPage(page)
  }

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number.parseInt(e.target.value))
    setCurrentPage(1)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="financial-support" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - now using the improved PageHeader component */}
        <PageHeader title="Financial Support" />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {/* Fundraising Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trust Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Website
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fundraisingData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.trustName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleWebsiteClick(item.website)}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {item.website}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.email.includes("@") ? (
                          <a href={`mailto:${item.email}`} className="text-sm text-gray-900 hover:underline">
                            {item.email}
                          </a>
                        ) : (
                          <div className="text-sm text-gray-900">{item.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.phone}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-2">Show rows:</span>
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="10">10 items</option>
                  <option value="20">20 items</option>
                  <option value="50">50 items</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded ${
                    currentPage === 1
                      ? "text-gray-400 border-gray-200"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => handlePageClick(1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === 1
                      ? "bg-yellow-400 text-white border-yellow-400"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  1
                </button>

                <button
                  onClick={() => handlePageClick(2)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === 2
                      ? "bg-yellow-400 text-white border-yellow-400"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  2
                </button>

                <button
                  onClick={() => handlePageClick(3)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === 3
                      ? "bg-yellow-400 text-white border-yellow-400"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  3
                </button>

                <span className="px-3 py-1 text-gray-700">...</span>

                <button
                  onClick={() => handlePageClick(50)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === 50
                      ? "bg-yellow-400 text-white border-yellow-400"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  50
                </button>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 border rounded ${
                    currentPage === totalPages
                      ? "text-gray-400 border-gray-200"
                      : "text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default FundraisingPage
