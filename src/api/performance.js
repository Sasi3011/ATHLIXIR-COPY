// Simulated backend API for performance data and medical documents
// In a real application, this would make HTTP requests to a backend server

// Get performance data from localStorage
const getPerformanceDataFromStorage = () => {
  return JSON.parse(localStorage.getItem("performanceData")) || {}
}

// Save performance data to localStorage
const savePerformanceDataToStorage = (data) => {
  localStorage.setItem("performanceData", JSON.stringify(data))
}

// Get medical documents from localStorage
const getMedicalDocumentsFromStorage = () => {
  return JSON.parse(localStorage.getItem("medicalDocuments")) || []
}

// Save medical documents to localStorage
const saveMedicalDocumentsToStorage = (documents) => {
  localStorage.setItem("medicalDocuments", JSON.stringify(documents))
}

// Initialize with some sample data if empty
const initializePerformanceData = () => {
  const performanceData = getPerformanceDataFromStorage()

  if (Object.keys(performanceData).length === 0) {
    const sampleData = {
      "athlete@example.com": {
        sprintPerformance: {
          progress: 55,
          tasksCompleted: 8,
          totalTasks: 15,
        },
        matchAnalysis: {
          progress: 30,
          metricsAnalyzed: 8,
          totalMetrics: 40,
        },
        coachFeedback: {
          progress: 89,
          feedbackAddressed: 40,
          totalFeedback: 55,
        },
        trainingConsistency: 95,
        trainingStats: {
          wins: 40,
          losses: 79,
          attempts: 89,
        },
      },
    }

    savePerformanceDataToStorage(sampleData)
  }

  const medicalDocuments = getMedicalDocumentsFromStorage()

  if (medicalDocuments.length === 0) {
    const sampleDocuments = [
      {
        id: "doc1",
        email: "athlete@example.com",
        name: "Annual Medical Certificate",
        documentType: "Medical Certificate",
        issuingAuthority: "Sports Medicine Center",
        issueDate: "2023-05-15",
        expiryDate: "2024-05-15",
        uploadedAt: "2023-05-20T10:30:00Z",
        verified: true,
        confidenceScore: 98,
        verificationDate: "2023-05-21T14:20:00Z",
        verificationNotes:
          "Document verified successfully. All security features present and valid. Digital signature verified with issuing authority.",
        imageUrl: "/placeholder.svg?height=300&width=200",
      },
      {
        id: "doc2",
        email: "athlete@example.com",
        name: "Fitness Assessment Report",
        documentType: "Assessment Report",
        issuingAuthority: "National Sports Institute",
        issueDate: "2023-06-10",
        expiryDate: null,
        uploadedAt: "2023-06-12T15:45:00Z",
        verified: false,
        confidenceScore: 32,
        verificationDate: "2023-06-13T09:15:00Z",
        verificationNotes:
          "Document verification failed. Inconsistent formatting and missing security watermark. Digital signature could not be verified with issuing authority.",
        imageUrl: "/placeholder.svg?height=300&width=200",
      },
    ]

    saveMedicalDocumentsToStorage(sampleDocuments)
  }
}

// Initialize data
initializePerformanceData()

// Get performance data for an athlete
export const getPerformanceData = async (email) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const performanceData = getPerformanceDataFromStorage()
  return performanceData[email] || null
}

// Get medical documents for an athlete
export const getMedicalDocuments = async (email) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const documents = getMedicalDocumentsFromStorage()
  return documents.filter((doc) => doc.email === email)
}

// Upload a medical document
export const uploadMedicalDocument = async (email, documentData) => {
  // Simulate API request delay and document processing
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const documents = getMedicalDocumentsFromStorage()

  // Simulate AI/ML verification
  const isVerified = Math.random() > 0.3 // 70% chance of being verified as genuine
  const confidenceScore = isVerified ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 10

  const newDocument = {
    id: `doc${Date.now()}`,
    email,
    name: documentData.name,
    documentType: "Medical Certificate",
    issuingAuthority: "Sports Medicine Center",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: null,
    uploadedAt: new Date().toISOString(),
    verified: isVerified,
    confidenceScore,
    verificationDate: new Date().toISOString(),
    verificationNotes: isVerified
      ? "Document verified successfully. All security features present and valid."
      : "Document verification failed. Inconsistent formatting and missing security features.",
    imageUrl: "/placeholder.svg?height=300&width=200",
  }

  documents.push(newDocument)
  saveMedicalDocumentsToStorage(documents)

  return newDocument
}

// Update performance data for an athlete
export const updatePerformanceData = async (email, data) => {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const performanceData = getPerformanceDataFromStorage()

  performanceData[email] = {
    ...performanceData[email],
    ...data,
  }

  savePerformanceDataToStorage(performanceData)

  return performanceData[email]
}
