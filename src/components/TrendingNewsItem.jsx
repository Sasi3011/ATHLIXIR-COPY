import { ChevronRight } from "lucide-react"

const TrendingNewsItem = ({ item }) => {
  const { tag, date, title, image } = item

  return (
    <div className="flex items-center mb-3 sm:mb-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
      <div className="w-14 h-14 sm:w-16 sm:h-16 mr-2 sm:mr-3 overflow-hidden rounded-md flex-shrink-0">
        <img
          src={image || "/placeholder.jpg"}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.jpg"
          }}
        />
      </div>
      <div className="flex-1 min-w-0"> {/* min-width-0 helps with text truncation */}
        <div className="text-xs text-gray-500 mb-1 truncate">
          {tag} • {date}
        </div>
        <h4 className="text-xs sm:text-sm font-medium group-hover:text-blue-600 transition-colors line-clamp-2">{title}</h4>
      </div>
      <ChevronRight className="w-4 h-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity ml-1 flex-shrink-0" />
    </div>
  )
}

export default TrendingNewsItem
