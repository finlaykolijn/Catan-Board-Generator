// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// API endpoints
export const API_ENDPOINTS = {
  GET_BOARDS: `${API_BASE_URL}/api/get-boards`,
  SAVE_BOARD: `${API_BASE_URL}/api/save-board`,
}; 