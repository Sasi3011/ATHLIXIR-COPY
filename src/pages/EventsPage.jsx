"use client"

import { useState } from "react"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState("Upcoming")
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "National Athletics Meet",
      sport: "Athletics",
      date: "15th April 2025",
      location: "New Delhi",
      registered: false,
    },
    {
      id: 2,
      name: "Marathon Challenge 2025",
      sport: "Running",
      date: "10th May 2025",
      location: "Chennai",
      registered: true,
    },
    {
      id: 3,
      name: "Youth Wrestling Tournament",
      sport: "Wrestling",
      date: "25th June 2025",
      location: "Jaipur",
      registered: true,
    },
    {
      id: 4,
      name: "Senior Weightlifting Championship",
      sport: "Weightlifting",
      date: "12th July 2025",
      location: "Lucknow",
      registered: true,
    },
    {
      id: 5,
      name: "National Gymnastics Meet",
      sport: "Gymnastics",
      date: "15th August 2025",
      location: "Guwahati",
      registered: false,
    },
    {
      id: 6,
      name: "Boxing Selection Trials",
      sport: "Boxing",
      date: "30th August 2025",
      location: "Raipur",
      registered: true,
    },
    {
      id: 7,
      name: "WSF World Cup",
      sport: "Squash",
      date: "Not Mentioned",
      location: "Chennai",
      registered: false,
    },
  ])

  const handleRegistrationToggle = (id) => {
    setEvents(
      events.map((event) => {
        if (event.id === id) {
          return { ...event, registered: !event.registered }
        }
        return event
      }),
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="events" />

      <div className="flex-1 flex flex-col">
        {/* Header - now using the improved PageHeader component */}
        <PageHeader title="Events" />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "Upcoming"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("Upcoming")}
              >
                Upcoming
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "Previous"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("Previous")}
              >
                Previous
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "Ongoing"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("Ongoing")}
              >
                Ongoing
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sport
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.sport}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={event.registered}
                          onChange={() => handleRegistrationToggle(event.id)}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}

export default EventsPage
