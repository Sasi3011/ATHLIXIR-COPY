"use client"

import { useState, useEffect } from "react"

const DocumentImageDisplay = ({ document }) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Clean up any object URLs when component unmounts
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc)
      }
    }
  }, [imageSrc])

  useEffect(() => {
    if (!document) return

    setError(false)

    // Handle File object (for newly uploaded documents)
    if (document.file instanceof File) {
      if (document.file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(document.file)
        setImageSrc(objectUrl)
      } else if (document.file.type === 'application/pdf') {
        // For PDFs, we could use a PDF thumbnail or icon
        setImageSrc('/pdf-icon.png')
      } else {
        setError(true)
      }
    } 
    // Handle imageUrl (for documents fetched from server)
    else if (document.imageUrl) {
      setImageSrc(document.imageUrl)
    } 
    // Handle base64 data
    else if (document.base64Data) {
      setImageSrc(document.base64Data)
    }
    // No valid image source
    else {
      setError(true)
    }
  }, [document])

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 mx-auto text-gray-400 mb-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <p className="text-gray-500">Document preview not available</p>
        </div>
      </div>
    )
  }

  if (!imageSrc) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="animate-pulse rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <img
        src={imageSrc}
        alt="Medical Document"
        className="w-full h-auto object-contain"
        onError={() => setError(true)}
      />
    </div>
  )
}

export default DocumentImageDisplay
