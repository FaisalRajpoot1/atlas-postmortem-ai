import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'Server error';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response
      throw new Error('Unable to reach the server. Please check your connection.');
    } else {
      // Error in request setup
      throw new Error('Request failed. Please try again.');
    }
  }
);

export async function analyzeIncident(incident) {
  const response = await api.post('/analyze-incident', { incident });
  return response.data;
}

export async function getSampleIncidents() {
  const response = await api.get('/sample-incidents');
  return response.data;
}

export async function healthCheck() {
  const response = await api.get('/health');
  return response.data;
}

export async function getLLMInfo() {
  const response = await api.get('/llm-info');
  return response.data;
}

export default api;
