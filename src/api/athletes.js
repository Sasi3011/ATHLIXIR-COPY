import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/athlete` : 'https://athlixir-backend.onrender.com/api/athlete';

// Log the API URL for debugging
console.log('Athlete API_URL:', API_URL);

// Save athlete profile
export const saveAthleteProfile = async (profileData) => {
  try {
    console.log('Sending POST request to:', `${API_URL}/profile`);
    const response = await axios.post(`${API_URL}/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data; // Returns { success: true, athlete }
  } catch (error) {
    console.error('Save athlete profile error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to save athlete profile');
  }
};

// Get athlete profile
export const getAthleteProfile = async (email) => {
  try {
    console.log('Fetching profile for:', email);
    const response = await axios.get(`${API_URL}/profile/${email}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data; // Returns athlete profile data
  } catch (error) {
    console.error('Get athlete profile error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to fetch athlete profile');
  }
};

// Update athlete profile
export const updateAthleteProfile = async (profileData) => {
  try {
    console.log('Updating profile for:', profileData.email);
    const response = await axios.put(`${API_URL}/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data; // Returns updated profile data
  } catch (error) {
    console.error('Update athlete profile error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to update athlete profile');
  }
};

// Update profile photo
export const updateProfilePhoto = async (email, photoData) => {
  try {
    console.log('Updating profile photo for:', email);
    const response = await axios.put(
      `${API_URL}/profile/photo`,
      { email, profilePhoto: photoData },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data; // Returns success status
  } catch (error) {
    console.error('Update profile photo error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to update profile photo');
  }
};

// Get all athlete profiles
export const getAllAthleteProfiles = async () => {
  try {
    console.log('Fetching all athlete profiles');
    const response = await axios.get(`${API_URL}/profiles`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data; // Returns array of athlete profiles
  } catch (error) {
    console.error('Get all athlete profiles error:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Failed to fetch athlete profiles');
  }
};