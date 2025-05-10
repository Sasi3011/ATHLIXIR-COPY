"use client"
import { ChevronRight } from "lucide-react"

const CategoryItem = ({ category, icon, isActive, onClick }) => {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
        isActive ? "bg-blue-50" : "hover:bg-gray-50"
      }`}
      onClick={() => onClick(category)}
    >
      <div className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
            isActive ? "bg-yellow-400" : "bg-yellow-100"
          }`}
        >
          {icon}
        </div>
        <span className={`font-medium ${isActive ? "text-blue-600" : "text-gray-700"}`}>{category}</span>
      </div>
      <ChevronRight className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-yellow-400"}`} />
    </div>
  )
}

export default CategoryItem
