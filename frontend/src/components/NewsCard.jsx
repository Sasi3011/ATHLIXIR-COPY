import { formatDate } from "../utils/dateUtils"

const NewsCard = ({ article, size = "large" }) => {
  const { title, description, urlToImage, publishedAt, source } = article

  // Extract sport category from article if available
  const getSportCategory = () => {
    const sportCategories = ["Basketball", "Football", "Cricket", "Hockey", "Tennis", "Golf", "Kabaddi", "Kho - Kho"]

    for (const sport of sportCategories) {
      if (title?.includes(sport) || description?.includes(sport)) {
        return sport
      }
    }

    // Default category based on source
    const sourceMap = {
      espn: "Basketball",
      nhl: "Hockey",
      cricinfo: "Cricket",
      bcci: "Cricket",
      fifa: "Football",
    }

    return sourceMap[source?.id] || "Sports"
  }

  const sportCategory = getSportCategory()
  const formattedDate = formatDate(publishedAt)

  if (size === "small") {
    return (
      <div className="flex flex-col mb-4">
        <div className="text-sm text-gray-500 mb-1">{formattedDate}</div>
        <h3 className="text-base font-semibold mb-1">{title}</h3>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="relative">
          <img
          src={(urlToImage?.startsWith("http://") ? urlToImage.replace("http://", "https://") : urlToImage) || "/placeholder.jpg"}
          alt={title}
          className="w-full h-56 object-cover rounded-lg"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.jpg"
          }}
        />

        <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
          {sportCategory}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-sm text-gray-500 mb-1">{formattedDate}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-700 line-clamp-3">{description}</p>
      </div>
    </div>
  )
}

export default NewsCard
