export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    get AUTH_URL() {
      // Check if BASE_URL already contains /api to avoid duplication
      return this.BASE_URL.endsWith('/api') ? `${this.BASE_URL}/auth` : `${this.BASE_URL}/api/auth`;
    },
    get SOCKET_URL() {
      return import.meta.env.VITE_SOCKET_URL || this.BASE_URL;
    }
  };