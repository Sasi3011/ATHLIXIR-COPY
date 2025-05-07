import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

export const initSocket = () => {
  socket.on('connect', () => {
    console.log('Connected to Socket.IO server');
  });

  socket.on('userLogin', (data) => {
    console.log('User logged in:', data);
    // You can add code here to show a notification or update the UI
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from Socket.IO server');
  });
};

export default socket;