"use client"

import { useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"

const AddAchievementModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    event: "",
    medalType: "gold",
    date: new Date().toISOString().split("T")[0],
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    description: "",
    isCareerHighlight: false,
    isPersonalBest: false,
    performanceList: [""],
    mediaFiles: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handlePerformanceChange = (index, value) => {
    const updatedList = [...formData.performanceList]
    updatedList[index] = value
    setFormData((prev) => ({
      ...prev,
      performanceList: updatedList,
    }))
  }

  const addPerformanceItem = () => {
    setFormData((prev) => ({
      ...prev,
      performanceList: [...prev.performanceList, ""],
    }))
  }

  const removePerformanceItem = (index) => {
    const updatedList = formData.performanceList.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      performanceList: updatedList.length > 0 ? updatedList : [""],
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setFormData((prev) => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files],
    }))
  }

  const removeFile = (index) => {
    const updatedFiles = formData.mediaFiles.filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      mediaFiles: updatedFiles,
    }))
  }

  const validateStep1 = () => {
    if (!formData.title.trim()) {
      setError("Title is required")
      return false
    }
    if (!formData.event.trim()) {
      setError("Event is required")
      return false
    }
    if (!formData.date) {
      setError("Date is required")
      return false
    }
    return true
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setError("")
      setStep(2)
    }
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      setLoading(true)

      // Filter out empty performance items
      const filteredPerformanceList = formData.performanceList.filter((item) => item.trim() !== "")

      // Create achievement object
      const achievementData = {
        ...formData,
        id: Date.now().toString(),
        performanceList: filteredPerformanceList,
        createdAt: new Date().toISOString(),
      }

      await onSubmit(achievementData)
    } catch (error) {
      console.error("Error submitting achievement:", error)
      setError("Failed to add achievement. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none" onClick={onClose}>
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Achievement</h3>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                  {step === 1 ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Achievement Title*
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="e.g. Gold Medal - 100m Sprint"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-1">
                          Event/Competition*
                        </label>
                        <input
                          type="text"
                          id="event"
                          name="event"
                          value={formData.event}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="e.g. National Athletics Meet - 2023"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="medalType" className="block text-sm font-medium text-gray-700 mb-1">
                          Achievement Type
                        </label>
                        <select
                          id="medalType"
                          name="medalType"
                          value={formData.medalType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                          <option value="gold">Gold Medal</option>
                          <option value="silver">Silver Medal</option>
                          <option value="bronze">Bronze Medal</option>
                          <option value="state">State-Level Achievement</option>
                          <option value="national">National-Level Achievement</option>
                          <option value="personal">Personal Best</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                          Achievement Date*
                        </label>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          required
                        />
                      </div>

                      <div className="flex space-x-4">
                        <div className="flex-1">
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                          </label>
                          <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                        <div className="flex-1">
                          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isCareerHighlight"
                            name="isCareerHighlight"
                            checked={formData.isCareerHighlight}
                            onChange={handleChange}
                            className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
                          />
                          <label htmlFor="isCareerHighlight" className="ml-2 block text-sm text-gray-700">
                            Career Highlight
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isPersonalBest"
                            name="isPersonalBest"
                            checked={formData.isPersonalBest}
                            onChange={handleChange}
                            className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
                          />
                          <label htmlFor="isPersonalBest" className="ml-2 block text-sm text-gray-700">
                            Personal Best
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Describe your achievement..."
                        ></textarea>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Performance Details</label>
                        {formData.performanceList.map((item, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handlePerformanceChange(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              placeholder="e.g. Sprint Time: 10.15 sec"
                            />
                            <button
                              type="button"
                              onClick={() => removePerformanceItem(index)}
                              className="ml-2 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addPerformanceItem}
                          className="mt-1 flex items-center text-sm text-yellow-500 hover:text-yellow-600"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Performance Detail
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Media (Photos/Videos)</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-500 hover:text-yellow-400 focus-within:outline-none"
                              >
                                <span>Upload files</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                  multiple
                                  accept="image/*,video/*"
                                  onChange={handleFileChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4 up to 10MB</p>
                          </div>
                        </div>

                        {formData.mediaFiles.length > 0 && (
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {formData.mediaFiles.map((file, index) => (
                              <div key={index} className="relative">
                                <div className="h-20 w-full bg-gray-100 rounded-md flex items-center justify-center">
                                  {file.type.startsWith("image/") ? (
                                    <img
                                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                                      alt={`Upload ${index + 1}`}
                                      className="h-full w-full object-cover rounded-md"
                                    />
                                  ) : (
                                    <video
                                      src={URL.createObjectURL(file)}
                                      className="h-full w-full object-cover rounded-md"
                                    />
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {step === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-400 text-base font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Next
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-400 text-base font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 sm:ml-3 sm:w-auto sm:text-sm ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Saving..." : "Save Achievement"}
                </button>
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Back
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddAchievementModal
