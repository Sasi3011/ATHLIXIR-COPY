import axios from 'axios';

// Configure axios defaults - CORRECT VERSION
const configureAxios = () => {
  axios.defaults.withCredentials = true;
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  
  // IMPORTANT: Remove this line - clients should not set CORS headers
  // axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  
  // Set up response interceptor for better error handling
  axios.interceptors.response.use(
    response => response,
    error => {
      console.error('Axios error:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Request error:', error.message);
      }
      return Promise.reject(error);
    }
  );
  
  // JWT token handling
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default configureAxios;