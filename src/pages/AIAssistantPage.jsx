"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Sidebar from "../components/Sidebar"
import { getAthleteProfile } from "../api/athletes"
import { getPerformanceData } from "../api/performance"
import { Mic, Paperclip, ArrowUp } from "lucide-react"
import { generateAIResponse } from "../api/aiAssistant"
import AI from "../assets/AI.jpg"
// Import the PageHeader component
import PageHeader from "../components/PageHeader"

const AIAssistantPage = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [athleteData, setAthleteData] = useState(null)
  const [performanceData, setPerformanceData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [inputMessage, setInputMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Suggested topics for quick access
  const suggestedTopics = [
    "Training Plan",
    "Injury Recovery",
    "Nutrition Advice",
    "Mental Health Support",
    "Event Updates",
    "Sponsorship Finder",
    "Performance Tips",
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser && currentUser.email) {
          const athleteProfile = await getAthleteProfile(currentUser.email)
          setAthleteData(athleteProfile)

          const performance = await getPerformanceData(currentUser.email)
          setPerformanceData(performance)

          // Add welcome message
          setMessages([
            {
              id: 1,
              sender: "ai",
              text: `Hello ${athleteProfile?.fullName || "there"}! I'm your AI Assistant. How can I help you with your training, health, or career today?`,
              timestamp: new Date(),
            },
          ])
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

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on load
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus()
    }
  }, [loading])

  const handleSendMessage = async (text = inputMessage) => {
    if (!text.trim()) return

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      // Generate AI response based on user message and athlete data
      const response = await generateAIResponse(text, athleteData, performanceData)

      // Add AI response to chat
      const aiMessage = {
        id: messages.length + 2,
        sender: "ai",
        text: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error generating AI response:", error)

      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        sender: "ai",
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleTopicClick = (topic) => {
    handleSendMessage(`Tell me about ${topic}`)
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
      <Sidebar activePage="carrier-assistant" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="z-10 bg-white shadow">
        <PageHeader title="AI Assistant" athleteData={athleteData} />
      </div>

        {/* Main content */}
        <main className="flex-1 relative bg-gray-50">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4 mt-4">{error}</div>}

          <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col">
            {/* Main heading */}
            <div className="text-center px-4 pt-6 pb-4">
            <h2 className="text-4xl font-bold text-gray-800">How Can I Assist You Today?</h2>
          </div>

            {/* Chat container */}
            <div className="flex-1 flex flex-col bg-white mx-4 rounded-lg shadow-md overflow-hidden">
              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender === "ai" && (
                        <div className="flex-shrink-0 mr-3">
                          <img src={AI} alt="AI Assistant" className="h-8 w-8 rounded-full object-cover" />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          message.sender === "user" ? "bg-yellow-400 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {message.sender === "ai" && (
                      <div className="flex-shrink-0 mr-3">
                        <img src={AI} alt="AI Assistant" className="h-8 w-8 rounded-full object-cover" />
                      </div>
                    )}

                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex-shrink-0 mr-3">
                        <img src={AI} alt="AI Assistant" className="h-8 w-8 rounded-full object-cover" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Suggested topics */}
              <div className="px-4 py-3 border-t border-gray-200 flex flex-wrap justify-center gap-2">
                {suggestedTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicClick(topic)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>

              {/* Input area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-end space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      ref={inputRef}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything about your training, health, or career!"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                      rows={1}
                    ></textarea>
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim()}
                      className={`absolute right-2 bottom-2 p-2 rounded-full ${
                        inputMessage.trim() ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <ArrowUp className="h-5 w-5" />
                    </button>
                  </div>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                    <Mic className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AIAssistantPage
