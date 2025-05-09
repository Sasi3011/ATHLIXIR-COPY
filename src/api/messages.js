import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get athlete profile
export const getAthleteProfile = async (email) => {
  const response = await axios.get(`${API_URL}/athlete/profile`, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
    params: { email },
  });
  return response.data;
};

// Get all conversations for a user
export const getConversations = async () => {
  const response = await axios.get(`${API_URL}/messages`, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
  return response.data;
};

// Get messages for a conversation
export const getMessages = async (conversationId) => {
  const response = await axios.get(`${API_URL}/messages/${conversationId}`, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
  return response.data;
};

// Send a message (not used directly since Socket.IO handles this)
export const sendMessage = async (messageData) => {
  const response = await axios.post(`${API_URL}/messages`, messageData, {
    headers: { 'x-auth-token': localStorage.getItem('token') },
  });
  return response.data;
};

// Mark messages as read
export const markAsRead = async (conversationId, userEmail) => {
  return true; // Handled via Socket.IO
};

// Archive/unarchive a conversation
export const toggleArchiveConversation = async (conversationId) => {
  const response = await axios.put(
    `${API_URL}/messages/${conversationId}/archive`,
    {},
    { headers: { 'x-auth-token': localStorage.getItem('token') } }
  );
  return response.data;
};

// Create a new conversation
export const createConversation = async (participantEmail) => {
  const response = await axios.post(
    `${API_URL}/messages/create`,
    { participantEmail },
    { headers: { 'x-auth-token': localStorage.getItem('token') } }
  );
  return response.data;
};