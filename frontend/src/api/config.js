export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'https://athlixir-backend.onrender.com',
    get AUTH_URL() {
      return `${this.BASE_URL}/api/auth`;
    },
    get SOCKET_URL() {
      return import.meta.env.VITE_SOCKET_URL || this.BASE_URL;
    }
  };