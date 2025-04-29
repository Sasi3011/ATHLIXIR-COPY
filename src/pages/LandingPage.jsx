"use client"

import { useRef } from "react"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import {AboutUs} from "../assets/About Us.png"
import {Performance} from "../assets/Performance.png"
import {Top} from "../assets/LandingPageTop.png"
import {Optimize} from "../assets/Optimize.png"
import {Contact1} from "../assets/Contact 1"
import {Contact2} from "../assets/Contact 2"
import {Contact3} from "../assets/Contact 3"
const LandingPage = () => {
  const aboutRef = useRef(null)
  const featuresRef = useRef(null)
  const contactRef = useRef(null)

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" })
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Header
        onAboutClick={() => scrollToSection(aboutRef)}
        onFeaturesClick={() => scrollToSection(featuresRef)}
        onContactClick={() => scrollToSection(contactRef)}
      />

      {/* Hero Section */}
      <section className="bg-gray-50 py-16 md:py-24 lg:py-30">
        <div className="container mx-auto px-4 md:px-15 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-10">
              Train Smarter, Perform Better with <span className="text-yellow-400">ATHLIXIR</span>
            </h1>
            <p className=" font-semi-bold ">No matter where you are in your fitness journey — beginner or elite — ATHLIXIR is your edge.</p>
            <p className="text-gray-800 mb-10 max-w-lg">
                  Tap into expert insights, real-time performance data, and tailored guidance designed to elevate your training, speed up recovery, and break through limits.
            </p>
            <Link
              to="/login"
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
            >
              Get Started
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img src={Top}alt="Athletes training" className="w-120 h-100" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-2">About ATHLIXIR</h2>
          <h3 className="text-2xl text-gray-700 mb-6">One Platform, Every Athlete's Success!</h3>
          <p className="max-w-3xl mx-auto text-gray-600 mb-12">
            ATHLIXIR is built for athletes, coaches, and teams to track progress, optimize training, and achieve peak
            performance. Our AI-powered platform provides real-time insights, smart training schedules, and seamless
            event management—all in one place.
          </p>

          <h3 className="text-2xl font-bold mb-8">Who Can Benefit from ATHLIXIR?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md shadow-yellow-200">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">Athletes</h4>
              <p className="text-gray-600">
                Improve performance with data-driven tracking, tailored tools for both elite athletes and adaptive
                sports.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md shadow-yellow-200">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">Athletic Organizations & Communities</h4>
              <p className="text-gray-600">Manage athletes, events, and progress effectively.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md shadow-yellow-200">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">Coaches & Trainers</h4>
              <p className="text-gray-600">Monitor clients, schedules, and competitions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why ATHLIXIR Stands Out */}
      <section className="bg-gray-50 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <img src={AboutUs} alt="ATHLIXIR features" className="w-170 h-100" />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold mb-6">Why ATHLIXIR Stands Out?</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Data-Driven Triumph</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Personalized training & performance insights</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Designed for all athletes, with adaptive sports experts</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Seamless integration with wearable tech for real-time feedback</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Empowering every athlete, regardless of ability</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link
                to="/login"
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-10 md:py-20 lg:py-25">
        <div className="container mx-auto px-4 md:px-20">
          <h2 className="text-4xl font-bold text-center mb-5">Features</h2>

          <div className="flex flex-col md:flex-row items-center mb-16">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h3 className="text-3xl font-bold mb-4">
                Empowering Athletes with <span className="text-yellow-400">Smart Performance Insights</span>
              </h3>
              <p className="text-gray-600 mb-6">
                We help athletes, coaches, and teams train smarter and perform better with cutting-edge tools designed
                for success.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">2,245,341</h4>
                    <p className="text-sm text-gray-500">Registered Athletes</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">828,867</h4>
                    <p className="text-sm text-gray-500">Training Sessions Tracked</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">46,328</h4>
                    <p className="text-sm text-gray-500">Teams & Clubs Managed</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">1,926,436</h4>
                    <p className="text-sm text-gray-500">Feedback Processed</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center" >
              <img
                src={Performance}
                alt="Performance insights"
                className="w-120 h-120 rounded-lg shadow-lg"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center">
            <div className="md:w-1/2">
              <img
                src={Optimize}
                alt="Athletic journey"
                className="w-130 h-100 rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
              <h3 className="text-2xl font-bold mb-4">
                Optimize Your Athletic Journey with <span className="text-yellow-400">ATHLIXIR</span>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-yellow-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Smart Performance Tracking</h4>
                    <p className="text-gray-600">Real-time analytics to monitor progress.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-yellow-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">AI-Driven Training Plans</h4>
                    <p className="text-gray-600">Personalized programs tailored to your goals.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-yellow-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Leaderboard & Rankings</h4>
                    <p className="text-gray-600">Track your progress, compare stats, and climb the ranks.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-yellow-100 rounded-full p-2 mr-3 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold">Inclusive for All Athletes</h4>
                    <p className="text-gray-600">Supporting para-athletes and adaptive sports.</p>
                  </div>
                </li>
              </ul>
              <div className="mt-8">
                <Link
                  to="/login"
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="bg-gray-50 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Stay Connected with <span className="text-yellow-400">ATHLIXIR</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-12">
            Got questions? Need support? We're here to help! Whether you're an athlete, coach, or parent, we'll elevate
            your performance together.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src={Contact1}
                alt="Training support"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">Need Help with Training & Performance?</h3>
              <Link to="/login" className="inline-block text-yellow-500 hover:text-yellow-600 font-medium mt-2">
                Contact Support →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src={Contact2}
                alt="Partnership"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">Partner with ATHLIXIR</h3>
              <Link to="/login" className="inline-block text-yellow-500 hover:text-yellow-600 font-medium mt-2">
                Join Us →
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <img
                src={Contact3}
                alt="Technical support"
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold mb-2">Technical Assistance & Troubleshooting</h3>
              <Link to="/login" className="inline-block text-yellow-500 hover:text-yellow-600 font-medium mt-2">
                Get Help →
              </Link>
            </div>
          </div>

          <div className="mt-16 bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-2">
              We're just a <span className="text-yellow-400">message</span> away!
            </h3>
            <h4 className="text-xl mb-6">
              Let's <span className="text-yellow-400">connect</span> and build
              <span className="text-yellow-400"> success</span> together.
            </h4>
            <Link
              to="/login"
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 px-6 rounded-md transition duration-300"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
