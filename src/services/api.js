// const API_BASE_URL = 'http://localhost:5000/api';


// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Generic API request handler
// const apiRequest = async (endpoint, params = {}) => {
//   const url = new URL(`${API_BASE_URL}${endpoint}`);
  
//   // Add parameters to URL
//   Object.keys(params).forEach(key => {
//     if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
//       url.searchParams.append(key, params[key]);
//     }
//   });

//   try {
//     const response = await fetch(url);
    
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
//     }
    
//     return await response.json();
//   } catch (error) {
//     if (error.name === 'TypeError' && error.message.includes('fetch')) {
//       throw new Error('Unable to connect to NASA API server. Please ensure the backend is running.');
//     }
//     throw error;
//   }
// };


const BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Generic API request helper
 * @param {string} endpoint   – e.g. '/apod'
 * @param {object} params     – query‑string key/value pairs
 * @returns {Promise<any>}    – parsed JSON
 */
export const apiRequest = async (endpoint, params = {}) => {
  // -------------------------------------------------------------------------
  // 2)   Build the URL safely for both:
  //      • absolute bases ("http://localhost:5000/api")
  //      • relative bases ("/api")
  // -------------------------------------------------------------------------
  const url = BASE.startsWith('http')
    ? new URL(`${BASE}${endpoint}`)
    : new URL(`${BASE}${endpoint}`, window.location.origin);

  // 3)   Append non‑empty query params
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  }

  // 4)   Execute request + basic error handling
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || `HTTP ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (err) {
    // Network / CORS / DNS errors surface as TypeError in Fetch API
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error(
        'Unable to connect to NASA API server. Please ensure the backend is running.'
      );
    }
    throw err;
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