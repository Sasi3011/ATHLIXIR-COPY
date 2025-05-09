"use client"

import Logo from "../assets/Logo.png"
import { Link, useLocation } from "react-router-dom"
import { useTheme } from "../context/ThemeContext"
import {
  LayoutGrid,
  BarChart2,
  Trophy,
  IndianRupee,
  Calendar,
  MessageSquare,
  Bot,
  MapPin,
  Newspaper,
  Settings,
  Moon,
  Sun,
} from "lucide-react"

const Sidebar = ({ activePage }) => {
  const location = useLocation()
  const { darkMode, toggleDarkMode } = useTheme()

  const isActive = (path) => {
    return location.pathname === path || activePage === path.substring(1)
  }

  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: <LayoutGrid size={20} /> },
    { path: "/performance", name: "Performance", icon: <BarChart2 size={20} /> },
    { path: "/achievements", name: "Achievements", icon: <Trophy size={20} /> },
    { path: "/financial-support", name: "Financial Support", icon: <IndianRupee size={20} /> },
    { path: "/events", name: "Events", icon: <Calendar size={20} /> },
    { path: "/messages", name: "Messages", icon: <MessageSquare size={20} /> },
    { path: "/ai-assistant", name: "AI Assistant", icon: <Bot size={20} /> },
    { path: "/academy-locator", name: "Academy Locator", icon: <MapPin size={20} /> },
    { path: "/sports-news", name: "News Feed", icon: <Newspaper size={20} /> },
  ]

  return (
    <div className="w-60 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-5 border-b border-gray-200 shadow-sm">
        <Link to="/dashboard" className="flex items-center">
          <img src={Logo} alt="Athlixir" className="h-8" />
          <span className="ml-2 text-xl font-bold text-yellow-500">Athlixir</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors font-extrabold ${
                  isActive(item.path) ? "bg-yellow-50 text-yellow-500" : "text-gray-700 hover:bg-gray-100"
                }`}                
              >
                <span className={`${isActive(item.path) ? "text-yellow-500" : "text-gray-500"}`}>{item.icon}</span>
                <span className="ml-3 font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Link
          to="/settings"
          className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Settings size={20} className="text-gray-500" />
          <span className="ml-3 font-medium">Settings</span>
        </Link>

        <button
          onClick={toggleDarkMode}
          className="flex items-center w-full px-3 py-2 mt-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {darkMode ? <Sun size={20} className="text-gray-500" /> : <Moon size={20} className="text-gray-500" />}
          <span className="ml-3 font-medium">Dark Mode</span>
          <div
            className={`ml-auto w-10 h-5 rounded-full p-1 transition-colors ${darkMode ? "bg-yellow-600" : "bg-gray-300"}`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white transform transition-transform ${darkMode ? "translate-x-5" : "translate-x-0"}`}
            ></div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
