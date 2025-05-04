"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, Search, X, Star, Filter, ChevronDown, Phone, Globe, Clock, Award } from "lucide-react"
import { getAcademies, getAvailableSports, getNearbyAcademies } from "../api/academies"
import Sidebar from "../components/Sidebar"
import PageHeader from "../components/PageHeader"
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const AcademyLocatorPage = () => {
  const [academies, setAcademies] = useState([])
  const [filteredAcademies, setFilteredAcademies] = useState([])
  const [selectedAcademy, setSelectedAcademy] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const [mapLoaded, setMapLoaded] = useState(true) // Always true since we don't need to load external script
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [activeTab, setActiveTab] = useState("nearby")
  const [availableSports, setAvailableSports] = useState(["All"])
  const [selectedSport, setSelectedSport] = useState("All")
  const [sortBy, setSortBy] = useState("distance")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const mapRef = useRef(null)
  const searchInputRef = useRef(null)
  const navigate = useNavigate()
  const leafletMapRef = useRef(null) // Reference to store the Leaflet map instance

  // Fix for Leaflet marker icon issue in React
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Update the loadAllAcademies function to be properly memoized
  const loadAllAcademies = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getAcademies()
      setAcademies(data)
      setFilteredAcademies(data)
      setIsLoading(false)
    } catch (err) {
      setError("Failed to load academies. Please try again later.")
      setIsLoading(false)
    }
  }, [])

  // Load nearby academies
  const loadNearbyAcademies = useCallback(async (location) => {
    try {
      setIsLoading(true)
      const data = await getNearbyAcademies(location)
      setAcademies(data)
      setFilteredAcademies(data)
      setIsLoading(false)
    } catch (err) {
      setError("Failed to load nearby academies. Please try again later.")
      setIsLoading(false)
    }
  }, [])

  // Initialize map when component mounts
  useEffect(() => {
    // Load academies immediately when component mounts
    loadAllAcademies()

    // Initialize Leaflet map
    if (mapRef.current && !leafletMapRef.current) {
      // Default center (India)
      const defaultCenter = [20.5937, 78.9629]; // Note: Leaflet uses [lat, lng] format

      // Create Leaflet map
      const mapInstance = L.map(mapRef.current).setView(defaultCenter, 5);
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstance);

      // Store map instance in ref and state
      leafletMapRef.current = mapInstance;
      setMap(mapInstance);

      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(userPos);
            
            // Center map on user location
            mapInstance.setView([userPos.lat, userPos.lng], 12);

            // Add user marker
            const userIcon = L.divIcon({
              className: 'user-location-marker',
              html: '<div style="background-color: #4285F4; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            });

            L.marker([userPos.lat, userPos.lng], { icon: userIcon, title: 'Your Location' }).addTo(mapInstance);

            // Load nearby academies
            loadNearbyAcademies(userPos);
          },
          (error) => {
            console.error("Error getting user location:", error);
            loadAllAcademies();
          }
        );
      } else {
        loadAllAcademies();
      }
    }
  }, [loadAllAcademies, loadNearbyAcademies]);

  // Add a useEffect to ensure academies are loaded even if map initialization fails
  useEffect(() => {
    // If after 2 seconds we still don't have academies, load them anyway
    const timer = setTimeout(() => {
      if (academies.length === 0 && !isLoading) {
        loadAllAcademies()
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [academies.length, isLoading, loadAllAcademies])

  // Load available sports for filtering
  useEffect(() => {
    const loadSports = async () => {
      try {
        const sports = await getAvailableSports()
        setAvailableSports(sports)
      } catch (err) {
        console.error("Failed to load sports:", err)
      }
    }

    loadSports()
  }, [])

  // Update markers when academies change
  useEffect(() => {
    if (map && filteredAcademies.length > 0 && leafletMapRef.current) {
      // Clear existing markers
      markers.forEach((marker) => {
        if (leafletMapRef.current) {
          leafletMapRef.current.removeLayer(marker);
        }
      });

      // Create bounds object to fit all markers
      const bounds = L.latLngBounds();

      // Add user location to bounds if available
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }

      // Create new markers
      const newMarkers = filteredAcademies.map((academy) => {
        const marker = L.marker([academy.location.lat, academy.location.lng], {
          title: academy.name
        }).addTo(leafletMapRef.current);

        // Add click event to marker
        marker.on('click', () => {
          setSelectedAcademy(academy);
          leafletMapRef.current.panTo([academy.location.lat, academy.location.lng]);
        });

        // Add popup with academy name
        marker.bindPopup(academy.name);

        // Add academy location to bounds
        bounds.extend([academy.location.lat, academy.location.lng]);

        return marker;
      });

      setMarkers(newMarkers);

      // Fit map to bounds if we have markers
      if (newMarkers.length > 0) {
        leafletMapRef.current.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 16
        });
      }
    }
  }, [map, filteredAcademies, userLocation]);

  // Handle search input change
  const handleSearchChange = useCallback(
    async (e) => {
      const value = e.target.value
      setSearchTerm(value)

      try {
        const filters = {
          search: value,
          sport: selectedSport !== "All" ? selectedSport : null,
          sortBy: sortBy,
        }

        if (userLocation && sortBy === "distance") {
          filters.userLocation = userLocation
        }

        const data = await getAcademies(filters)
        setFilteredAcademies(data)
      } catch (err) {
        console.error("Search error:", err)
      }
    },
    [selectedSport, sortBy, userLocation],
  )

  // Handle sport filter change
  const handleSportChange = useCallback(
    async (sport) => {
      setSelectedSport(sport)

      try {
        const filters = {
          search: searchTerm,
          sport: sport !== "All" ? sport : null,
          sortBy: sortBy,
        }

        if (userLocation && sortBy === "distance") {
          filters.userLocation = userLocation
        }

        const data = await getAcademies(filters)
        setFilteredAcademies(data)
      } catch (err) {
        console.error("Filter error:", err)
      }
    },
    [searchTerm, sortBy, userLocation],
  )

  // Handle sort change
  const handleSortChange = useCallback(
    async (sort) => {
      setSortBy(sort)

      try {
        const filters = {
          search: searchTerm,
          sport: selectedSport !== "All" ? selectedSport : null,
          sortBy: sort,
        }

        if (userLocation && sort === "distance") {
          filters.userLocation = userLocation
        }

        const data = await getAcademies(filters)
        setFilteredAcademies(data)
      } catch (err) {
        console.error("Sort error:", err)
      }
    },
    [searchTerm, selectedSport, userLocation],
  )

  // Handle tab change
  const handleTabChange = useCallback(
    (tab) => {
      setActiveTab(tab)

      if (tab === "nearby" && userLocation) {
        loadNearbyAcademies(userLocation)
      } else if (tab === "topRated") {
        getAcademies({ sortBy: "rating", minRating: 4.5 }).then((data) => {
          setFilteredAcademies(data)
        })
      }
    },
    [userLocation, loadNearbyAcademies],
  )

  // Clear search
  const clearSearch = () => {
    setSearchTerm("")
    searchInputRef.current.focus()

    if (activeTab === "nearby" && userLocation) {
      loadNearbyAcademies(userLocation)
    } else {
      loadAllAcademies()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage="academy-locator" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - now using the improved PageHeader component */}
        <PageHeader title="Academy Locator" />

        {/* Main content */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left sidebar */}
          <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
            {/* Search input */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search academies..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {searchTerm && (
                  <button onClick={clearSearch} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === "nearby"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabChange("nearby")}
              >
                Academies near me
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === "topRated"
                    ? "text-yellow-500 border-b-2 border-yellow-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabChange("topRated")}
              >
                Top-Rated Academies
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filters</span>
                </div>
                <button
                  className="text-xs text-yellow-500 hover:text-yellow-600"
                  onClick={() => {
                    setSelectedSport("All")
                    setSortBy("distance")
                    if (activeTab === "nearby" && userLocation) {
                      loadNearbyAcademies(userLocation)
                    } else {
                      loadAllAcademies()
                    }
                  }}
                >
                  Reset All
                </button>
              </div>

              {/* Sport filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                <div className="relative">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={selectedSport}
                    onChange={(e) => handleSportChange(e.target.value)}
                  >
                    {availableSports.map((sport) => (
                      <option key={sport} value={sport}>
                        {sport}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Sort filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <div className="relative">
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="distance">Distance</option>
                    <option value="rating">Rating</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Academy list */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : filteredAcademies.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No academies found. Try adjusting your filters.</div>
              ) : (
                <div>
                  {filteredAcademies.map((academy) => (
                    <div
                      key={academy.id}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedAcademy?.id === academy.id ? "bg-yellow-50" : ""
                      }`}
                      onClick={() => {
                        setSelectedAcademy(academy)
                        if (leafletMapRef.current) {
                          leafletMapRef.current.setView([academy.location.lat, academy.location.lng], 15)
                        }
                      }}
                    >
                      <h3 className="font-medium text-gray-900">{academy.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        <span className="truncate">{academy.address}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="ml-1 text-sm font-medium">{academy.rating}</span>
                        </div>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{academy.reviews} reviews</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {academy.sports.map((sport) => (
                          <span
                            key={sport}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                          >
                            {sport}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            <div ref={mapRef} className="absolute inset-0"></div>

            {/* Academy details overlay */}
            {selectedAcademy && (
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg rounded-t-lg max-h-[50%] overflow-y-auto">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-900">{selectedAcademy.name}</h2>
                    <button className="text-gray-400 hover:text-gray-600" onClick={() => setSelectedAcademy(null)}>
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{selectedAcademy.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{selectedAcademy.reviews} reviews</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{selectedAcademy.type}</span>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                    <div className="flex items-start mb-2">
                      <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <span>{selectedAcademy.address}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Phone className="h-5 w-5 mr-2 text-gray-400" />
                      <span>{selectedAcademy.phone}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <Globe className="h-5 w-5 mr-2 text-gray-400" />
                      <a
                        href={selectedAcademy.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-500 hover:underline"
                      >
                        {selectedAcademy.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-gray-400" />
                      <span>{selectedAcademy.hours}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 mb-2">About</h3>
                    <p className="text-sm text-gray-600">{selectedAcademy.description}</p>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedAcademy.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center text-sm text-gray-600">
                          <div className="h-2 w-2 rounded-full bg-yellow-400 mr-2"></div>
                          {amenity}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-medium text-gray-900 mb-2">Coaches</h3>
                    <div className="space-y-2">
                      {selectedAcademy.coaches.map((coach) => (
                        <div key={coach.name} className="flex items-start">
                          <Award className="h-5 w-5 mr-2 text-yellow-500 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{coach.name}</div>
                            <div className="text-xs text-gray-500">
                              {coach.specialization} • {coach.experience}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                      onClick={() => {
                        // Open directions in OpenStreetMap
                        window.open(
                          `https://www.openstreetmap.org/directions?from=${userLocation ? userLocation.lat + ',' + userLocation.lng : ''}&to=${selectedAcademy.location.lat},${selectedAcademy.location.lng}`,
                          "_blank",
                        )
                      }}
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
          <div className="mb-2">
            <span className="font-bold text-yellow-500">ATHLIXIR</span> - Find the Best Training Academies
          </div>
          <p>
            Discover top sports academies tailored to your needs. Whether you're an aspiring athlete or a seasoned
            professional, find the right place to train and excel.
          </p>
        </footer>
      </div>
    </div>
  )
}

export default AcademyLocatorPage
