"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Sidebar from "../components/Sidebar"
import { getAthleteProfile } from "../api/athletes"
import { getConversations, getMessages, sendMessage, markAsRead } from "../api/messages"
import { Phone, PinIcon, MoreVertical, Smile, Paperclip, Send, X, ChevronDown } from "lucide-react"
// Import the PageHeader component
import PageHeader from "../components/PageHeader"

const MessagesPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [athleteData, setAthleteData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [conversations, setConversations] = useState([])
  const [activeTab, setActiveTab] = useState("open")
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [showUserInfo, setShowUserInfo] = useState(true)
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState({})
  const messagesEndRef = useRef(null)
  const messageInputRef = useRef(null)

  // Initialize socket connection
  useEffect(() => {
    // In a real app, this would connect to your actual WebSocket server
    // For this demo, we'll simulate WebSocket behavior
    const socketInstance = {
      on: (event, callback) => {
        // Store callbacks for simulation
        if (event === "receive_message") {
          socketInstance.receiveMessageCallback = callback
        } else if (event === "user_status") {
          socketInstance.userStatusCallback = callback
        }
      },
      emit: (event, data) => {
        console.log(`Socket emitted ${event}:`, data)
        // Simulate server response for demo purposes
        if (event === "send_message") {
          // Only simulate receiving messages from others, not our own messages
          // This prevents duplication
          if (data.sender !== currentUser.email && data.receiver === currentUser.email) {
            setTimeout(() => {
              if (socketInstance.receiveMessageCallback) {
                socketInstance.receiveMessageCallback(data)
              }
            }, 300)
          }
        }
      },
      // Simulate disconnect
      disconnect: () => {
        console.log("Socket disconnected")
      },
    }

    setSocket(socketInstance)

    // Simulate some users being online
    const simulatedOnlineUsers = {
      "renuka@example.com": true,
      "thanusha@example.com": true,
      "coach@example.com": true,
    }
    setOnlineUsers(simulatedOnlineUsers)

    // Cleanup on unmount
    return () => {
      if (socketInstance.disconnect) {
        socketInstance.disconnect()
      }
    }
  }, [currentUser?.email])

  // Fetch athlete data and conversations
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser && currentUser.email) {
          const athleteProfile = await getAthleteProfile(currentUser.email)
          setAthleteData(athleteProfile)

          const conversationsData = await getConversations(currentUser.email)
          setConversations(conversationsData)

          // Set first conversation as active by default if available
          if (conversationsData.length > 0) {
            setActiveConversation(conversationsData[0])
          }
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

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (activeConversation) {
        try {
          const messagesData = await getMessages(activeConversation.id)
          setMessages(messagesData)

          // Mark messages as read
          if (activeConversation.unreadCount > 0) {
            await markAsRead(activeConversation.id, currentUser.email)

            // Update conversations list to reflect read status
            setConversations((prevConversations) =>
              prevConversations.map((conv) => (conv.id === activeConversation.id ? { ...conv, unreadCount: 0 } : conv)),
            )
          }
        } catch (error) {
          console.error("Error fetching messages:", error)
        }
      }
    }

    fetchMessages()
  }, [activeConversation, currentUser])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Listen for new messages from socket
  useEffect(() => {
    if (socket) {
      socket.on("receive_message", (message) => {
        // Only add the message if it belongs to the active conversation
        // and it's not already in our messages list (prevent duplicates)
        if (message.conversationId === activeConversation?.id) {
          setMessages((prev) => {
            // Check if this message is already in our list
            const messageExists = prev.some((msg) => msg.id === message.id)
            if (messageExists) {
              return prev
            }
            return [...prev, message]
          })
        }

        // Update unread count in conversations list
        setConversations((prevConversations) =>
          prevConversations.map((conv) => {
            if (conv.id === message.conversationId && conv.id !== activeConversation?.id) {
              return { ...conv, unreadCount: (conv.unreadCount || 0) + 1 }
            }
            return conv
          }),
        )
      })

      socket.on("user_status", ({ userId, status }) => {
        setOnlineUsers((prev) => ({
          ...prev,
          [userId]: status === "online",
        }))
      })
    }

    return () => {
      if (socket) {
        if (typeof socket.off === "function") {
          socket.off("receive_message")
          socket.off("user_status")
        }
      }
    }
  }, [socket, activeConversation])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const messageData = {
      id: messageId,
      conversationId: activeConversation.id,
      sender: currentUser.email,
      receiver: activeConversation.participant.email,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    }

    try {
      // Add message to UI immediately for responsiveness
      setMessages((prev) => [...prev, messageData])
      setNewMessage("")

      // Focus back on input
      messageInputRef.current?.focus()

      // Send to API
      await sendMessage(messageData)

      // Update the conversation in the list with the new message
      setConversations((prevConversations) =>
        prevConversations.map((conv) => {
          if (conv.id === activeConversation.id) {
            return {
              ...conv,
              lastMessage: `You: ${messageData.content.length > 30 ? messageData.content.substring(0, 30) + "..." : messageData.content}`,
              lastMessageTime: messageData.timestamp,
            }
          }
          return conv
        }),
      )

      // Emit to socket for real-time delivery
      // In a real app, the server would handle routing to the correct recipient
      if (socket) {
        socket.emit("send_message", messageData)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Failed to send message")

      // Remove the message from UI if it failed to send
      setMessages((prev) => prev.filter((msg) => msg.id !== messageData.id))
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault() // Prevent newline
      if (newMessage.trim()) {
        handleSendMessage()
      }
    }
  }

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatConversationTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return formatMessageTime(timestamp)
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "numeric", day: "numeric" })
    }
  }

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation)
  }

  const isToday = (timestamp) => {
    const date = new Date(timestamp)
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const groupMessagesByDate = (messages) => {
    const groups = {}

    messages.forEach((message) => {
      const date = new Date(message.timestamp)
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }

      groups[dateKey].push(message)
    })

    return Object.entries(groups).map(([dateKey, messages]) => {
      const date = new Date(messages[0].timestamp)
      let label = "Today"

      if (!isToday(date)) {
        label = date.toLocaleDateString([], { month: "long", day: "numeric" })
      }

      return {
        date: label,
        messages,
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  const messageGroups = groupMessagesByDate(messages)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="messages" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <PageHeader title="Messages" athleteData={athleteData} />

        {/* Main content */}
        <main className="flex-1 overflow-hidden flex">
          {/* Conversations list */}
          <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Chat</h2>
                <button className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-white">
                  <span className="text-sm font-bold">+</span>
                </button>
              </div>

              <div className="flex border-b border-gray-200">
                <button
                  className={`flex-1 py-2 text-center ${
                    activeTab === "open" ? "text-gray-800 border-b-2 border-yellow-400 font-medium" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("open")}
                >
                  Open
                </button>
                <button
                  className={`flex-1 py-2 text-center ${
                    activeTab === "archived"
                      ? "text-gray-800 border-b-2 border-yellow-400 font-medium"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("archived")}
                >
                  Archived
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations
                .filter((conv) => (activeTab === "open" ? !conv.archived : conv.archived))
                .map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 flex items-start space-x-3 cursor-pointer hover:bg-gray-50 ${
                      activeConversation?.id === conversation.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="relative">
                      <img
                        src={`https://ui-avatars.com/api/?name=${conversation.participant.name}&background=FFD700&color=fff`}
                        alt={conversation.participant.name}
                        className="h-10 w-10 rounded-full"
                      />
                      {onlineUsers[conversation.participant.email] && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.participant.name}</h3>
                        <span className="text-xs text-gray-500">
                          {formatConversationTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="flex-shrink-0 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{conversation.unreadCount}</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col bg-white">
            {activeConversation ? (
              <>
                {/* Chat header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={`https://ui-avatars.com/api/?name=${activeConversation.participant.name}&background=FFD700&color=fff`}
                        alt={activeConversation.participant.name}
                        className="h-10 w-10 rounded-full"
                      />
                      {onlineUsers[activeConversation.participant.email] && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{activeConversation.participant.name}</h3>
                      <p className="text-xs text-gray-500">
                        {onlineUsers[activeConversation.participant.email] ? "Online" : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-500 hover:text-gray-700">
                      <Phone className="h-5 w-5" />
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <PinIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setShowUserInfo(!showUserInfo)}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {messageGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="mb-6">
                      <div className="flex justify-center mb-4">
                        <span className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">{group.date}</span>
                      </div>

                      {group.messages.map((message, index) => {
                        const isCurrentUser = message.sender === currentUser.email
                        const showAvatar = index === 0 || group.messages[index - 1].sender !== message.sender

                        return (
                          <div
                            key={message.id}
                            className={`flex items-start mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                          >
                            {!isCurrentUser && showAvatar && (
                              <img
                                src={`https://ui-avatars.com/api/?name=${activeConversation.participant.name}&background=FFD700&color=fff`}
                                alt={activeConversation.participant.name}
                                className="h-8 w-8 rounded-full mr-2 flex-shrink-0"
                              />
                            )}

                            {!isCurrentUser && !showAvatar && <div className="w-10 flex-shrink-0"></div>}

                            <div className="max-w-[70%]">
                              {message.content.startsWith("Check your") ? (
                                <div className="bg-yellow-400 text-white p-3 rounded-lg">
                                  <p>{message.content}</p>
                                </div>
                              ) : message.content.startsWith("Try AI-based") ? (
                                <div className="bg-yellow-400 text-white p-3 rounded-lg">
                                  <p>{message.content}</p>
                                  <div className="flex mt-2 space-x-2">
                                    <div className="bg-white rounded-lg p-2 w-16 h-16 flex items-center justify-center">
                                      <img
                                        src="/placeholder.svg?height=40&width=40"
                                        alt="AI tool"
                                        className="h-10 w-10"
                                      />
                                    </div>
                                    <div className="bg-white rounded-lg p-2 w-16 h-16 flex items-center justify-center">
                                      <img
                                        src="/placeholder.svg?height=40&width=40"
                                        alt="AI tool"
                                        className="h-10 w-10"
                                      />
                                    </div>
                                    <div className="bg-white rounded-lg p-2 w-16 h-16 flex items-center justify-center">
                                      <img
                                        src="/placeholder.svg?height=40&width=40"
                                        alt="AI tool"
                                        className="h-10 w-10"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={`p-3 rounded-lg ${
                                    isCurrentUser ? "bg-yellow-400 text-white" : "bg-white border border-gray-200"
                                  }`}
                                >
                                  <p>{message.content}</p>
                                </div>
                              )}
                              <div className="text-xs text-gray-500 mt-1 px-1">
                                {formatMessageTime(message.timestamp)}
                              </div>
                            </div>

                            {isCurrentUser && showAvatar && (
                              <img
                                src={`https://ui-avatars.com/api/?name=${athleteData?.fullName || "Hima Das"}&background=FFD700&color=fff`}
                                alt="You"
                                className="h-8 w-8 rounded-full ml-2 flex-shrink-0"
                              />
                            )}

                            {isCurrentUser && !showAvatar && <div className="w-10 flex-shrink-0"></div>}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end space-x-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                      <Paperclip className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        ref={messageInputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write your message..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                        rows={1}
                      ></textarea>
                      <button className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600">
                        <Smile className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={`p-3 rounded-full ${
                        newMessage.trim()
                          ? "bg-yellow-400 text-white hover:bg-yellow-500"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No conversation selected</h3>
                  <p className="text-gray-500 mt-1">Choose a conversation from the list or start a new one</p>
                </div>
              </div>
            )}
          </div>

          {/* User info sidebar */}
          {showUserInfo && activeConversation && (
            <div className="w-80 border-l border-gray-200 bg-white flex flex-col">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-medium">User Info</h2>
                <button onClick={() => setShowUserInfo(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 flex flex-col items-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${activeConversation.participant.name}&background=FFD700&color=fff&size=128`}
                  alt={activeConversation.participant.name}
                  className="h-24 w-24 rounded-full mb-3"
                />
                <h3 className="text-lg font-medium">{activeConversation.participant.name}</h3>
                <p className="text-sm text-gray-500">{activeConversation.participant.role || "Sprinter"}</p>

                <div className="flex items-center mt-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-xs text-gray-500">Athlixir</span>
                  <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
                </div>
              </div>

              <div className="p-4 border-t border-gray-200">
                <h3 className="font-medium mb-3">Community</h3>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <img
                      src="https://ui-avatars.com/api/?name=RunChamp&background=FFD700&color=fff"
                      alt="RunChamp Community"
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="text-sm font-medium">RunChamp Community</h4>
                      <p className="text-xs text-gray-500">Keep Moving!!! Born To Run...</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <img
                      src="https://ui-avatars.com/api/?name=ProRunners&background=FFD700&color=fff"
                      alt="ProRunners Club"
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="text-sm font-medium">ProRunners Club</h4>
                      <p className="text-xs text-gray-500">Tomorrow Is The Match!!</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <img
                      src="https://ui-avatars.com/api/?name=Beyond&background=FFD700&color=fff"
                      alt="Beyond Miles"
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="text-sm font-medium">Beyond Miles</h4>
                      <p className="text-xs text-gray-500">Get ready to book this match</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <img
                      src="https://ui-avatars.com/api/?name=Runners&background=FFD700&color=fff"
                      alt="Runners Network"
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="text-sm font-medium">Runners Network</h4>
                      <p className="text-xs text-gray-500">Choose Comfortable Shoes</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <button className="text-sm text-yellow-500 hover:text-yellow-600 font-medium">See All</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default MessagesPage
