"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

const Header = ({ onAboutClick, onFeaturesClick, onContactClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-yellow-400">ATHLIXIR</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={onAboutClick} className="text-gray-600 hover:text-gray-900 transition duration-150">
              About Us
            </button>
            <button onClick={onFeaturesClick} className="text-gray-600 hover:text-gray-900 transition duration-150">
              Features
            </button>
            <button onClick={onContactClick} className="text-gray-600 hover:text-gray-900 transition duration-150">
              Contact Us
            </button>
            <Link to="/login" className="text-gray-600 hover:text-gray-900 transition duration-150">
              Login
            </Link>
            <Link
              to="/login"
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md transition duration-150"
            >
              Sign Up
            </Link>
          </nav>

          <div className="md:hidden">
            <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => {
                onAboutClick()
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              About Us
            </button>
            <button
              onClick={() => {
                onFeaturesClick()
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Features
            </button>
            <button
              onClick={() => {
                onContactClick()
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Contact Us
            </button>
            <Link to="/login" className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              Login
            </Link>
            <Link to="/login" className="block px-3 py-2 bg-yellow-400 text-white hover:bg-yellow-500 rounded-md">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
