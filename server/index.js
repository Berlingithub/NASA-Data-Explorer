import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE_URL = 'https://api.nasa.gov';

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
const handleApiError = (error, endpoint) => {
  console.error(`Error fetching ${endpoint}:`, error.message);
  if (error.response) {
    return {
      error: error.response.data.error?.message || 'NASA API Error',
      status: error.response.status
    };
  }
  return {
    error: 'Network error occurred',
    status: 500
  };
};

// Routes

// Astronomy Picture of the Day
app.get('/api/apod', async (req, res) => {
  try {
    const { date, start_date, end_date, count } = req.query;
    const params = { api_key: NASA_API_KEY };
    
    if (date) params.date = date;
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;
    if (count) params.count = count;

    const response = await axios.get(`${NASA_BASE_URL}/planetary/apod`, { params });
    res.json(response.data);
  } catch (error) {
    const errorData = handleApiError(error, 'APOD');
    res.status(errorData.status).json(errorData);
  }
});

// Mars Rover Photos
app.get('/api/mars-photos', async (req, res) => {
  try {
    const { rover = 'curiosity', sol, earth_date, camera, page = 1 } = req.query;
    const params = { 
      api_key: NASA_API_KEY,
      page
    };
    
    if (sol) params.sol = sol;
    if (earth_date) params.earth_date = earth_date;
    if (camera) params.camera = camera;

    const response = await axios.get(`${NASA_BASE_URL}/mars-photos/api/v1/rovers/${rover}/photos`, { params });
    res.json(response.data);
  } catch (error) {
    const errorData = handleApiError(error, 'Mars Photos');
    res.status(errorData.status).json(errorData);
  }
});

// Mars Rover Manifests
app.get('/api/mars-manifests', async (req, res) => {
  try {
    const response = await axios.get(`${NASA_BASE_URL}/mars-photos/api/v1/manifests/curiosity`, {
      params: { api_key: NASA_API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    const errorData = handleApiError(error, 'Mars Manifests');
    res.status(errorData.status).json(errorData);
  }
});

// Near Earth Objects
app.get('/api/neo', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    const params = { api_key: NASA_API_KEY };
    
    if (start_date) params.start_date = start_date;
    if (end_date) params.end_date = end_date;

    const response = await axios.get(`${NASA_BASE_URL}/neo/rest/v1/feed`, { params });
    res.json(response.data);
  } catch (error) {
    const errorData = handleApiError(error, 'NEO');
    res.status(errorData.status).json(errorData);
  }
});

// NASA Image and Video Library
app.get('/api/images', async (req, res) => {
  try {
    const { q, media_type = 'image', page = 1 } = req.query;
    const params = { 
      q: q || 'space',
      media_type,
      page
    };

    const response = await axios.get('https://images-api.nasa.gov/search', { params });
    res.json(response.data);
  } catch (error) {
    const errorData = handleApiError(error, 'NASA Images');
    res.status(errorData.status).json(errorData);
  }
});

// Earth Polychromatic Imaging Camera (EPIC)
app.get('/api/epic', async (req, res) => {
  try {
    const { date } = req.query;
    const endpoint = date ? `natural/date/${date}` : 'natural';
    
    const response = await axios.get(`${NASA_BASE_URL}/EPIC/api/${endpoint}`, {
      params: { api_key: NASA_API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    const errorData = handleApiError(error, 'EPIC');
    res.status(errorData.status).json(errorData);
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// app.listen(PORT, () => {
//   console.log(`🚀 NASA Space Explorer Server running on port ${PORT}`);
//   console.log(`🌌 Using NASA API Key: ${NASA_API_KEY === 'DEMO_KEY' ? 'DEMO_KEY (Limited)' : 'Custom Key'}`);
// });

export default app; 

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 NASA Space Explorer Server running on port ${PORT}`);
    console.log(
      `🌌 Using NASA API Key: ${
        NASA_API_KEY === 'DEMO_KEY' ? 'DEMO_KEY (Limited)' : 'Custom Key'
      }`
    );
  });
}