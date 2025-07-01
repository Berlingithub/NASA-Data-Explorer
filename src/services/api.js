// const API_BASE_URL = 'http://localhost:5000/api';


// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Generic API request handler
const apiRequest = async (endpoint, params = {}) => {
  // const base = import.meta.env.VITE_API_BASE_URL || '/api';
  const base = import.meta.env.VITE_API_BASE_URL || '';
  // const url = new URL(`${base}${endpoint}`, window.location.origin);
  const url = new URL(`/api${endpoint}`, window.location.origin);
  
  // const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  // Add parameters to URL
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });

  try { 
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to NASA API server. Please ensure the backend is running.');
    }
    throw error;
  }
};

// Astronomy Picture of the Day
export const fetchAPOD = (params = {}) => {
  return apiRequest('/apod', params);
};

// Mars Rover Photos
export const fetchMarsPhotos = (params = {}) => {
  return apiRequest('/mars-photos', params);
};

// Mars Rover Manifests
export const fetchMarsManifests = () => {
  return apiRequest('/mars-manifests');
};

// Near Earth Objects
export const fetchNEO = (params = {}) => {
  return apiRequest('/neo', params);
};

// NASA Image and Video Library
export const fetchNASAImages = (params = {}) => {
  return apiRequest('/images', params);
};

// Earth Polychromatic Imaging Camera (EPIC)
export const fetchEPIC = (params = {}) => {
  return apiRequest('/epic', params);
};

// Health check
export const checkHealth = () => {
  return apiRequest('/health');
};

export default {
  fetchAPOD,
  fetchMarsPhotos,
  fetchMarsManifests,
  fetchNEO,
  fetchNASAImages,
  fetchEPIC,
  checkHealth
};