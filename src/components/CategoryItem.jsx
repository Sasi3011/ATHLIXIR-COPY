"use client"
import { ChevronRight } from "lucide-react"

const CategoryItem = ({ category, icon, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg cursor-pointer transition-colors mb-1 sm:mb-2 ${
        isActive ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
      onClick={() => onClick(category)}
    >
      <div className="flex items-center">
        <div
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 ${
            isActive ? "bg-yellow-400" : "bg-yellow-100"
          }`}
        >
          {icon}
        </div>
        <span className={`text-sm sm:text-base font-medium ${isActive ? "text-blue-600" : "text-gray-700"}`}>{category}</span>
      </div>
      <ChevronRight className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-yellow-400"}`} />
    </div>
  )
}

export default CategoryItem
