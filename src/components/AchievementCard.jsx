"use client"

import { useState } from "react"
import { Calendar, MoreVertical } from "lucide-react"

const AchievementCard = ({ achievement }) => {
  const [showMenu, setShowMenu] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const startMonth = start.toLocaleDateString("en-US", { month: "short" })
    const endMonth = end.toLocaleDateString("en-US", { month: "short" })
    const startYear = start.getFullYear()
    const endYear = end.getFullYear()

    if (startYear === endYear) {
      return `${startMonth} - ${endMonth} ${endYear}`
    }
    return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
  }

  const getProgressColor = () => {
    switch (achievement.medalType) {
      case "gold":
        return "bg-yellow-400"
      case "silver":
        return "bg-pink-500"
      case "bronze":
        return "bg-yellow-500"
      case "state":
        return "bg-blue-400"
      case "national":
        return "bg-orange-400"
      case "personal":
        return "bg-yellow-400"
      default:
        return "bg-gray-400"
    }
  }

  const getProgressWidth = () => {
    // Calculate width based on achievement level or other metrics
    switch (achievement.medalType) {
      case "gold":
        return "w-3/4"
      case "silver":
        return "w-4/5"
      case "bronze":
        return "w-2/3"
      case "state":
        return "w-1/2"
      case "national":
        return "w-4/5"
      case "personal":
        return "w-full"
      default:
        return "w-1/2"
    }
  }

  const getMedalLabel = () => {
    switch (achievement.medalType) {
      case "gold":
        return "Gold Medal"
      case "silver":
        return "Silver Medal"
      case "bronze":
        return "Bronze Medal"
      case "state":
        return "State-Level Achievement"
      case "national":
        return "National-Level Achievement"
      case "personal":
        return "Personal Best Record"
      default:
        return "Achievement"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        {/* Header with medal type and menu */}
        <div className="flex justify-between items-start mb-4">
          <div
            className={`text-sm font-medium ${achievement.medalType === "gold" ? "text-yellow-500" : achievement.medalType === "silver" ? "text-pink-500" : achievement.medalType === "bronze" ? "text-yellow-500" : achievement.medalType === "state" ? "text-blue-400" : achievement.medalType === "national" ? "text-orange-400" : "text-yellow-400"}`}
          >
            {getMedalLabel()}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Edit
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Share
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Achievement title and details */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{achievement.title}</h3>
        <p className="text-gray-700 mb-4">{achievement.event}</p>

        {/* Performance details */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800">Performance:</h4>
          {achievement.performanceDetails ? (
            <div className="mt-1">
              {achievement.performanceDetails.map((detail, index) => (
                <p key={index} className="text-gray-700">
                  {detail.label}: {detail.value}
                </p>
              ))}
            </div>
          ) : (
            <ul className="mt-1 list-disc list-inside">
              {achievement.performanceList?.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Date */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800">Date:</h4>
          <p className="text-gray-700">{formatDate(achievement.date)}</p>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${getProgressColor()} ${getProgressWidth()}`}></div>
        </div>
      </div>

      {/* Footer with date range and avatar */}
      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {formatDateRange(achievement.startDate || achievement.date, achievement.endDate || achievement.date)}
          </span>
        </div>
        <img
          src={achievement.athleteImage || "https://ui-avatars.com/api/?name=Hima+Das&background=FFD700&color=fff"}
          alt="Athlete"
          className="h-6 w-6 rounded-full"
        />
      </div>
    </div>
  )
}

export default AchievementCard
