import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth`;

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Log API_URL for debugging
console.log('Auth API_URL:', API_URL);

// Register
export const registerUser = async (email, password, userType) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password, userType });
    return response.data; // Returns { token, user: { id, email, userType } }
  } catch (error) {
    console.error('Register error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};

// Check profile completion
export const checkProfileCompletion = async (email) => {
  try {
    console.log('Checking profile completion for:', email);
    const response = await axios.get(`${API_URL}/profile-completion/${email}`);
    return response.data; // Returns boolean (true/false)
  } catch (error) {
    console.error('Profile completion error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to check profile completion');
  }
};

// Request password reset
export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/password-reset`, { email });
    return response.data; // Returns { message: 'Password reset email sent' }
  } catch (error) {
    console.error('Password reset request error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to request password reset');
  }
};

// Verify reset token
export const verifyResetToken = async (email, token) => {
  try {
    const response = await axios.post(`${API_URL}/verify-reset-token`, { email, token });
    return response.data; // Returns { valid: true }
  } catch (error) {
    console.error('Token verification error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Invalid or expired reset token');
  }
};

// Reset password
export const resetPassword = async (email, token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, { email, token, newPassword });
    return response.data; // Returns { message: 'Password reset successful' }
  } catch (error) {
    console.error('Password reset error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to reset password');
  }
};