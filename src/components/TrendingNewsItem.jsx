import { ChevronRight } from "lucide-react"

const TrendingNewsItem = ({ item }) => {
  const { tag, date, title, image } = item

  return (
    <div className="flex items-center mb-4 group cursor-pointer">
      <div className="w-16 h-16 mr-3 overflow-hidden rounded-md">
        <img
          src={image || "/placeholder.jpg"}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.jpg"
          }}
        />
      </div>
      <div className="flex-1">
        <div className="text-xs text-gray-500 mb-1">
          {tag} • {date}
        </div>
        <h4 className="text-sm font-medium group-hover:text-blue-600 transition-colors">{title}</h4>
      </div>
      <ChevronRight className="w-4 h-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  )
}

export default TrendingNewsItem
