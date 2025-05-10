import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Container, Typography, Paper, Grid, CircularProgress, Alert, TextField, MenuItem, IconButton, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { uploadDocument, getUserDocuments, downloadDocument, analyzeDocumentContent } from '../api/documentVerification';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

// Styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const DocumentPreview = styled('img')({
  width: '100%',
  height: 'auto',
  maxHeight: '300px',
  objectFit: 'contain',
  borderRadius: '4px',
  display: 'block', // Ensures the image is properly displayed
  border: '1px solid #ddd',
  backgroundColor: '#fff',
});

const DocumentCard = styled(Paper)(({ theme, darkMode }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: darkMode ? '#2d3748' : '#fff',
  color: darkMode ? '#fff' : '#000',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  },
}));

const ConfidenceIndicator = styled(Box)(({ confidence, theme }) => {
  let color = '#f44336'; // Red for low confidence
  if (confidence >= 70) {
    color = '#4caf50'; // Green for high confidence
  } else if (confidence >= 40) {
    color = '#ff9800'; // Orange for medium confidence
  }
  
  return {
    display: 'flex',
    alignItems: 'center',
    color: color,
    fontWeight: 'bold',
    marginTop: theme.spacing(1),
  };
});

const DocumentVerificationPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [documentType, setDocumentType] = useState('Medical Certificate');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [documents, setDocuments] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState('Not Verified');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [currentDocument, setCurrentDocument] = useState(null);

  // Document types
  const documentTypes = [
    'Medical Certificate',
    'Sports Fitness Certificate',
    'ID Proof',
    'Training Certificate',
    'Competition Certificate',
    'Other'
  ];

  // Fetch user documents on component mount
  useEffect(() => {
    if (currentUser?.id) {
      fetchUserDocuments();
    }
  }, [currentUser]);

  // Fetch user documents
  const fetchUserDocuments = async () => {
    try {
      setLoading(true);
      const data = await getUserDocuments(currentUser.id);
      setDocuments(data);
    } catch (error) {
      setError('Failed to fetch documents. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file change
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file type
    if (!selectedFile.type.includes('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError('');
    setSuccess('');
    
    // Create preview - ensure this works for any image type
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      console.log('Image preview created:', result.substring(0, 50) + '...');
      setPreview(result);
    };
    reader.onerror = () => {
      console.error('Error reading file');
      setError('Error creating preview. Please try another image.');
    };
    reader.readAsDataURL(selectedFile);
    
    // Analyze document content - always provide a confidence score
    await analyzeDocument(selectedFile);
  };

  // Analyze document content
  const analyzeDocument = async (documentFile) => {
    try {
      setAnalyzing(true);
      setError('');
      setSuccess('');
      
      const result = await analyzeDocumentContent(documentFile);
      
      // Set confidence score (default to 0)
      setConfidence(result.confidence || 0);
      
      // Always set verification status to Not Verified regardless of confidence
      setVerificationStatus('Not Verified');
      setVerificationNotes('Document verification failed. Please ensure you have uploaded a valid document and try again.');
      
      return result;
    } catch (error) {
      console.error('Error analyzing document:', error);
      setError('Failed to analyze document. Please try again.');
      setVerificationStatus('Not Verified');
      setConfidence(0);
      setVerificationNotes('Document analysis failed. Please try again with a clearer image.');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  // Handle document upload
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const documentData = {
        file,
        documentType,
        userId: currentUser.id,
      };
      
      // Upload document
      const uploadedDoc = await uploadDocument(documentData);
      setSuccess('Document uploaded successfully');
      
      // Set as current document
      setCurrentDocument(uploadedDoc);
      
      // Reset form
      setFile(null);
      setPreview(null);
      setDocumentType('Medical Certificate');
      
      // Refresh documents list
      fetchUserDocuments();
    } catch (error) {
      setError('Failed to upload document. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle document download
  const handleDownload = async (documentId) => {
    try {
      setError('');
      setSuccess('');
      await downloadDocument(documentId);
      setSuccess('Document downloaded successfully');
    } catch (error) {
      setError('Failed to download document. Please try again.');
      console.error(error);
    }
  };

  // Handle document deletion
  const handleDelete = async (documentId) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      await deleteDocument(documentId);
      setSuccess('Document deleted successfully');
      
      // Refresh the documents list
      await fetchUserDocuments();
    } catch (error) {
      setError('Failed to delete document. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom color={darkMode ? 'white' : 'primary'}>
        Document Verification
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              backgroundColor: darkMode ? '#1a202c' : '#fff',
              color: darkMode ? '#fff' : 'inherit'
            }}
          >
            <Typography variant="h6" gutterBottom>Upload New Document</Typography>
            
            <TextField
              select
              fullWidth
              label="Document Type"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              margin="normal"
              sx={{
                '& .MuiInputBase-input': {
                  color: darkMode ? '#fff' : 'inherit',
                },
                '& .MuiInputLabel-root': {
                  color: darkMode ? '#aaa' : 'inherit',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: darkMode ? '#555' : 'inherit',
                },
              }}
            >
              {documentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            
            <Box sx={{ my: 3, textAlign: 'center' }}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
                sx={{ mb: 2 }}
                disabled={loading}
              >
                Select Document
                <VisuallyHiddenInput type="file" onChange={handleFileChange} accept="image/*" />
              </Button>
              
              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {file.name}
                </Typography>
              )}
            </Box>
            
            <Box sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
              <Typography variant="subtitle1" gutterBottom>Document Preview</Typography>
              <Box 
                sx={{ 
                  border: '1px dashed grey', 
                  p: 2, 
                  borderRadius: 1,
                  backgroundColor: darkMode ? '#2d3748' : '#f5f5f5',
                  minHeight: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {preview ? (
                  <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <DocumentPreview 
                      src={preview} 
                      alt="Document preview" 
                      onError={(e) => {
                        console.error('Error loading image preview');
                        e.target.src = 'https://via.placeholder.com/300x200?text=Preview+Error';
                      }} 
                    />
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Document preview not available
                  </Typography>
                )}
              </Box>
              
              {analyzing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography>Analyzing document...</Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="subtitle1" sx={{ mr: 1 }}>
                      Confidence:
                    </Typography>
                    <Chip 
                      label={`${confidence}%`} 
                      color="error"
                    />
                  </Box>
                  
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="subtitle1" sx={{ mr: 1 }}>
                      Status:
                    </Typography>
                    <Chip 
                      label="Not Verified" 
                      color="error"
                      icon={<CancelIcon />}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  
                  {verificationNotes && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'error.main' }}>
                      {verificationNotes}
                    </Typography>
                  )}
                </>
              )}
            </Box>
            
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleUpload}
              disabled={!file || loading || analyzing}
            >
              {loading ? <CircularProgress size={24} /> : 'Upload Document'}
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              backgroundColor: darkMode ? '#1a202c' : '#fff',
              color: darkMode ? '#fff' : 'inherit'
            }}
          >
            <Typography variant="h6" gutterBottom>Your Documents</Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : documents.length === 0 ? (
              <Alert severity="info">You haven't uploaded any documents yet.</Alert>
            ) : (
              documents.map((doc) => (
                <DocumentCard 
                  key={doc._id} 
                  elevation={2} 
                  darkMode={darkMode}
                  onClick={() => {
                    setCurrentDocument(doc);
                    setPreview(doc.fileUrl);
                    setDocumentType(doc.documentType);
                    setConfidence(doc.confidence || 0);
                    setVerificationStatus('Not Verified');
                    setVerificationNotes('Document verification failed. Please ensure you have uploaded a valid document and try again.');
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      {doc.fileUrl ? (
                        <Box 
                          sx={{ 
                            height: 100, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: darkMode ? '#1a202c' : '#f5f5f5',
                            borderRadius: 1
                          }}
                        >
                          <img 
                            src={doc.fileUrl} 
                            alt={doc.documentType} 
                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} 
                          />
                        </Box>
                      ) : (
                        <Box 
                          sx={{ 
                            height: 100, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: darkMode ? '#1a202c' : '#f5f5f5',
                            borderRadius: 1
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Document preview not available
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} sm={8}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {doc.documentType}
                      </Typography>
                      
                      <Typography variant="body2" color={darkMode ? '#aaa' : 'text.secondary'}>
                        Uploaded on: {formatDate(doc.uploadDate)}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" color="error.main" sx={{ fontWeight: 'bold', mr: 1 }}>
                          Confidence: {doc.confidence || 0}%
                        </Typography>
                        <Chip 
                          size="small"
                          label="Not Verified" 
                          color="error"
                          icon={<CancelIcon sx={{ fontSize: 16 }} />}
                        />
                      </Box>
                      
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownload(doc._id)}
                        >
                          Download
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(doc._id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </DocumentCard>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Document Verification Results Section */}
      {preview && !analyzing && confidence > 0 && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mt: 4, 
            backgroundColor: darkMode ? '#1a202c' : '#fff',
            color: darkMode ? '#fff' : 'inherit'
          }}
        >
          <Typography variant="h6" gutterBottom>Document Verification Results</Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box 
                sx={{ 
                  border: '1px solid', 
                  borderColor: darkMode ? '#555' : '#ddd',
                  borderRadius: 1,
                  p: 2,
                  height: '100%'
                }}
              >
                <Typography variant="body2" color={darkMode ? '#aaa' : 'text.secondary'}>
                  Document Type:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {documentType}
                </Typography>
                
                <Typography variant="body2" color={darkMode ? '#aaa' : 'text.secondary'}>
                  Issuing Authority:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Unknown
                </Typography>
                
                <Typography variant="body2" color={darkMode ? '#aaa' : 'text.secondary'}>
                  Issue Date:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Unknown
                </Typography>
                
                <Typography variant="body2" color={darkMode ? '#aaa' : 'text.secondary'}>
                  Expiry Date:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  N/A
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box 
                sx={{ 
                  border: '1px solid', 
                  borderColor: darkMode ? '#555' : '#ddd',
                  borderRadius: 1,
                  p: 2,
                  height: '100%'
                }}
              >
                <Typography variant="body2" color={darkMode ? '#aaa' : 'text.secondary'}>
                  Verification Method:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  AI/ML Document Analysis
                </Typography>
                
                <Typography variant="body2" color={darkMode ? '#aaa' : 'text.secondary'}>
                  Verification Date:
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {formatDate(new Date())}
                </Typography>
                
                <Typography variant="body2" color={darkMode ? '#aaa' : 'text.secondary'}>
                  Confidence:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 1, color: 'error.main' }}>
                    {confidence}%
                  </Typography>
                  <Chip 
                    size="small"
                    label="Not Verified" 
                    color="error"
                    icon={<CancelIcon />}
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box 
                sx={{ 
                  border: '1px solid', 
                  borderColor: darkMode ? '#555' : '#ddd',
                  borderRadius: 1,
                  p: 2,
                  height: '100%'
                }}
              >
                <Typography variant="body2" color={darkMode ? '#aaa' : 'text.secondary'}>
                  Verification Notes:
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: 'error.main' }}>
                  Document verification failed. Please ensure you have uploaded a valid document and try again.
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      try {
                        // Create a download link for the preview image
                        if (preview) {
                          const link = document.createElement('a');
                          link.href = preview;
                          link.download = file ? file.name : 'document.png';
                          document.body.appendChild(link);
                          link.click();
                          setTimeout(() => {
                            link.remove();
                            setSuccess('Document downloaded successfully');
                          }, 100);
                          console.log('Download initiated for:', file?.name || 'document.png');
                        } else {
                          setError('No document available to download');
                        }
                      } catch (error) {
                        console.error('Download error:', error);
                        setError('Failed to download document. Please try again.');
                      }
                    }}
                  >
                    Download
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      // If this is a newly uploaded document that hasn't been saved yet
                      if (file) {
                        setFile(null);
                        setPreview(null);
                        setConfidence(0);
                        setSuccess('Document removed');
                      } else if (currentDocument && currentDocument._id) {
                        handleDelete(currentDocument._id);
                        setCurrentDocument(null);
                        setPreview(null);
                        setConfidence(0);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default DocumentVerificationPage;
