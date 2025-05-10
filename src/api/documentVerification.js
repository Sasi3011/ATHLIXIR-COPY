import axios from 'axios';

// Check if VITE_API_URL ends with /api to avoid duplication
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_URL = BASE_URL.endsWith('/api') ? `${BASE_URL}/documents` : `${BASE_URL}/api/documents`;

// Log the API URL for debugging
console.log('Document Verification API_URL:', API_URL);

// Upload document for verification
export const uploadDocument = async (documentData) => {
  try {
    const token = localStorage.getItem('token');
    
    const formData = new FormData();
    formData.append('document', documentData.file);
    formData.append('documentType', documentData.documentType);
    formData.append('userId', documentData.userId);
    
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        'x-auth-token': token
      },
    });
    return response.data;
  } catch (error) {
    console.error('Document upload error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to upload document');
  }
};

// Get document verification results
export const getDocumentVerification = async (documentId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/verify/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-auth-token': token
      },
    });
    return response.data;
  } catch (error) {
    console.error('Document verification error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to verify document');
  }
};

// Get user documents
export const getUserDocuments = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-auth-token': token
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get user documents error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to get user documents');
  }
};

// Download document
export const downloadDocument = async (documentId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_URL}/download/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-auth-token': token
      },
      responseType: 'blob'
    });
    
    // Create blob URL for download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `document-${documentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return true;
  } catch (error) {
    console.error('Document download error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to download document');
  }
};

// Delete document
export const deleteDocument = async (documentId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(`${API_URL}/${documentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-auth-token': token
      }
    });
    
    console.log('Document deleted successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Document deletion error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to delete document');
  }
};

// Analyze document content
export const analyzeDocumentContent = async (documentFile) => {
  try {
    // Create a form data object to send the file
    const formData = new FormData();
    formData.append('document', documentFile);
    
    const token = localStorage.getItem('token');
    
    // Make API call to analyze document content
    const response = await axios.post(`${API_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
        'x-auth-token': token
      },
    });
    
    // Log success and return data
    console.log('Document analysis successful:', response.data);
    
    // If the backend doesn't provide a verification status, set it to 'Not Verified' by default
    if (!response.data.verificationStatus) {
      response.data.verificationStatus = 'Not Verified';
    }
    
    // Ensure confidence score exists, default to 0 if not provided
    if (response.data.confidence === undefined) {
      response.data.confidence = 0;
    }
    
    return response.data;
  } catch (error) {
    // Log error and throw it for handling in the component
    console.error('Error analyzing document:', error);
    // Return default values for failed analysis
    return {
      confidence: 0,
      verificationStatus: 'Not Verified',
      verificationNotes: 'Document analysis failed. Please try again with a clearer image.'
    };
  }
};
