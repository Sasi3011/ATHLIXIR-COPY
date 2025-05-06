import axios from 'axios';
import { API_CONFIG } from './config';

// Log API_URL for debugging
console.log('Auth API_URL:', API_CONFIG.AUTH_URL);

// Register
export const registerUser = async (email, password, userType) => {
  try {
    const response = await axios.post(`${API_CONFIG.AUTH_URL}/register`, { email, password, userType });
    return response.data; // Returns { token, user: { id, email, userType } }
  } catch (error) {
    console.error('Register error:', error.response?.data);
    throw error.response?.data?.error ? 
      new Error(error.response.data.error) : 
      error;
  }
};

// Check profile completion
export const checkProfileCompletion = async (email) => {
  try {
    console.log('Checking profile completion for:', email);
    const response = await axios.get(`${API_CONFIG.AUTH_URL}/profile-completion/${email}`);
    return response.data; // Returns boolean (true/false)
  } catch (error) {
    console.error('Profile completion error:', error.response?.data);
    throw error.response?.data?.error ? 
      new Error(error.response.data.error) : 
      error;
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_CONFIG.AUTH_URL}/password-reset`, { email });
    return response.data; // Returns { message: 'Password reset email sent' }
  } catch (error) {
    console.error('Password reset request error:', error.response?.data);
    throw error.response?.data?.error ? 
      new Error(error.response.data.error) : 
      error;
  }
};

// Verify reset token
export const verifyResetToken = async (email, token) => {
  try {
    const response = await axios.post(`${API_CONFIG.AUTH_URL}/verify-reset-token`, { email, token });
    return response.data; // Returns { valid: true }
  } catch (error) {
    console.error('Token verification error:', error.response?.data);
    throw error.response?.data?.error ? 
      new Error(error.response.data.error) : 
      error;
  }
};

// Reset password
export const resetPassword = async (email, token, newPassword) => {
  try {
    const response = await axios.post(`${API_CONFIG.AUTH_URL}/reset-password`, { email, token, newPassword });
    return response.data; // Returns { message: 'Password reset successful' }
  } catch (error) {
    console.error('Password reset error:', error.response?.data);
    throw error.response?.data?.error ? 
      new Error(error.response.data.error) : 
      error;
  }
};