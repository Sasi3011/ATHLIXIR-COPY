"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getAthleteProfile } from "../api/athletes"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"
import Male from "../assets/Profile M.png"
import Female from "../assets/Profile F.png"
import Shikar from "../assets/Shikar Dawan.jpg"
import Himadas from "../assets/Hima Das.jpg"
import Post01 from "../assets/Post 1.1.jpg"
import Post02 from "../assets/Post 1.2.jpg"
import Post03 from "../assets/Post 2.1.jpg"
import Post04 from "../assets/Post 2.2.jpg"


const AthleteDashboard = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const [athleteData, setAthleteData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showProfileModal, setShowProfileModal] = useState(false)

  const [postContent, setPostContent] = useState("")
  const [postImages, setPostImages] = useState([])
  const [posts, setPosts] = useState([])
  const [editingPost, setEditingPost] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchAthleteData = async () => {
      try {
        if (currentUser && currentUser.email) {
          const data = await getAthleteProfile(currentUser.email)
          setAthleteData(data)
        }
      } catch (error) {
        console.error("Error fetching athlete data:", error)
        setError("Failed to load athlete data")
      } finally {
        setLoading(false)
      }
    }

    fetchAthleteData()
  }, [currentUser])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleProfileModal = () => {
    setShowProfileModal(!showProfileModal)
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)

    // Convert files to preview URLs
    const imageUrls = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))

    setPostImages((prev) => [...prev, ...imageUrls])
  }

  const createPost = () => {
    if (!postContent.trim() && postImages.length === 0) return

    const newPost = {
      id: Date.now().toString(),
      author: {
        name: athleteData?.fullName || "You",
        avatar: `https://ui-avatars.com/api/?name=${athleteData?.fullName || "User"}&background=FFD700&color=fff`,
      },
      content: postContent,
      images: postImages.map((img) => img.url),
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      shares: 0,
      isOwnPost: true,
    }

    setPosts((prev) => [newPost, ...prev])
    setPostContent("")
    setPostImages([])
  }

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId))
  }

  const startEditPost = (post) => {
    setEditingPost(post)
    setPostContent(post.content)
    setPostImages(post.images.map((url) => ({ url })))
  }

  const updatePost = () => {
    if (!editingPost) return

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === editingPost.id) {
          return {
            ...post,
            content: postContent,
            images: postImages.map((img) => img.url),
            edited: true,
          }
        }
        return post
      }),
    )

    setPostContent("")
    setPostImages([])
    setEditingPost(null)
  }

  const cancelEdit = () => {
    setPostContent("")
    setPostImages([])
    setEditingPost(null)
  }

  const removeImage = (index) => {
    setPostImages((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    // Initialize with some dummy posts
    setPosts([
      {
        id: "1",
        author: {
          name: "Shikhar Dhawan",
          avatar: Shikar,
        },
        content:
          "Proud of the boys for putting up a solid performance! Always special to contribute on the field and share these moments with the team. The grind continues, and the hunger never fades. Jai Hind! 🇮🇳💪🏏 #GabbarStyle #OnTheGo #CricketDiaries",
        images: [Post01, Post02],
        timestamp: new Date(Date.now() - 56 * 60 * 1000), // 56 mins ago
        likes: 2600,
        comments: 297,
        shares: 201,
        isOwnPost: false,
      },
      {
        id: "2",
        author: {
          name: "Hima Das",
          avatar: Himadas,
        },
        content:
          "Every stride on the track is powered by passion, discipline, and the dream to make my country proud 🇮🇳💫. Grateful for another win and the love from all of you! Let’s keep running forward — together. 🏃‍♀🔥 #HimaDas #DhingExpress #TrackAndField #ProudToRepresent",
        images: [Post03, Post04],
        timestamp: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
        likes: 2600,
        comments: 297,
        shares: 201,
        isOwnPost: false,
      },
    ])
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <PageHeader title="Dashboard" athleteData={athleteData} />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {/* Status update */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex items-start space-x-4">
            <img
                src={Male}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                  placeholder={editingPost ? "Edit your post..." : "What's on your mind?"}
                  rows={2}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                ></textarea>

                {postImages.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {postImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`Upload ${index}`}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-4">
                    <button
                      className="flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Image/Video</span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      <span>Live Video</span>
                    </button>
                  </div>
                  {editingPost ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={updatePost}
                        className="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={createPost}
                      className="px-4 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                    >
                      Post
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Posts */}
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.author.avatar || "/placeholder.svg"}
                          alt="Profile"
                          className="h-10 w-10 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium">{post.author.name}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(post.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            {post.edited && <span className="ml-1">(edited)</span>}
                          </p>
                        </div>
                      </div>

                      {post.isOwnPost && (
                        <div className="relative group">
                          <button className="p-1 rounded-full hover:bg-gray-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                          <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block">
                            <button
                              onClick={() => startEditPost(post)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deletePost(post.id)}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="mt-3">{post.content}</p>
                  </div>

                  {post.images && post.images.length > 0 && (
                    <div className={`grid ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-1`}>
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Post image ${index + 1}`}
                          className="w-full h-48 object-cover"
                        />
                      ))}
                    </div>
                  )}

                  <div className="p-4 flex items-center justify-between border-t">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-gray-500 hover:text-yellow-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span>{post.likes} Likes</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-yellow-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{post.comments} Comments</span>
                      </button>
                    </div>
                    <button className="flex items-center text-gray-500 hover:text-yellow-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                      <span>{post.shares} Share</span>
                    </button>
                  </div>
                  <div className="p-4 border-t flex items-center space-x-2">
                    <img
                      src={Male}
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                    <input
                      type="text"
                      placeholder="Write your message..."
                      className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              {/* Leaderboard */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Leaderboard</h2>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-6 text-center font-semibold">1</span>
                        <span className="ml-4">Amlan Borgohain</span>
                      </div>
                      <span className="font-medium">10.25s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-6 text-center font-semibold">2</span>
                        <span className="ml-4">Suresh Sathya</span>
                      </div>
                      <span className="font-medium">10.30s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-6 text-center font-semibold">3</span>
                        <span className="ml-4">Muhammed Anas Yahiya</span>
                      </div>
                      <span className="font-medium">10.36s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-6 text-center font-semibold">4</span>
                        <span className="ml-4">Dutee Chand</span>
                      </div>
                      <span className="font-medium">11.22s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-6 text-center font-semibold">5</span>
                        <span className="ml-4">Srabani Nanda</span>
                      </div>
                      <span className="font-medium">11.45s</span>
                    </div>
                    <div className="flex items-center justify-between bg-yellow-50 p-2 rounded">
                      <div className="flex items-center">
                        <span className="w-6 text-center font-semibold">20</span>
                        <span className="ml-4">{athleteData?.fullName || "You"}</span>
                      </div>
                      <span className="font-medium">12.74s</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Messages</h2>
                  <button className="text-sm text-yellow-500 hover:text-yellow-600">See All</button>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={Female}
                          alt="Profile"
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium">Dutee Chand</h3>
                          <p className="text-xs text-gray-500">Hi, How are you today?</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">08:30</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={Female}
                          alt="Profile"
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium">Kiran K</h3>
                          <p className="text-xs text-gray-500">Hi @Angel, I hope you are doing well...</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">07:00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={Female}
                          alt="Profile"
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="ml-3">
                          <h3 className="font-medium">Thanusha K</h3>
                          <p className="text-xs text-gray-500">Hi, How are you today?</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">23/11</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
export default AthleteDashboard
