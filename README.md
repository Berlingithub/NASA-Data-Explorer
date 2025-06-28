# NASA Space Explorer 🚀

A beautiful, interactive web application that showcases NASA's space data through a modern React frontend and Node.js backend. Explore stunning astronomy images, Mars rover photos, near-Earth objects, and NASA's vast image library.

##  Features

### 🌟 Core Functionality
- **Astronomy Picture of the Day (APOD)**: Browse daily space images with detailed descriptions
- **Mars Rover Gallery**: View photos from Curiosity, Opportunity, and Spirit rovers with advanced filtering
- **Near Earth Objects Tracker**: Monitor asteroids and their approach data with interactive visualizations
- **NASA Image Library**: Search through thousands of space images and videos
- **Real-time Data**: All data fetched directly from NASA's official APIs

### 🎨 Design & UX
- **Stunning Visual Design**: Deep space theme with animated star fields and gradient backgrounds
- **Responsive Layout**: Optimized for mobile, tablet, and desktop viewing
- **Smooth Animations**: Hover effects, transitions, and micro-interactions throughout
- **Glass Morphism UI**: Modern backdrop blur effects and translucent components
- **Interactive Data Visualization**: Custom charts and progress indicators

### 🔧 Technical Features
- **Full-Stack Architecture**: React frontend with Express.js backend
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Loading States**: Beautiful loading animations during data fetching
- **Performance Optimized**: Lazy loading, image optimization, and efficient API calls
- **Clean Code Structure**: Modular components and organized file architecture

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- NASA API Key (optional - demo key included)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   git clone <repository-url>
   cd nasa-space-explorer
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   # Copy the .env file (already includes demo key)
   # For production, get your free API key from https://api.nasa.gov/
   ```

3. **Start the Application**
   ```bash
   # Start both frontend and backend simultaneously
   npm run dev
   ```

   The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📋 API Endpoints

### Backend Routes
- `GET /api/apod` - Astronomy Picture of the Day
- `GET /api/mars-photos` - Mars Rover Photos
- `GET /api/neo` - Near Earth Objects
- `GET /api/images` - NASA Image Library Search
- `GET /api/epic` - Earth Polychromatic Imaging Camera
- `GET /api/health` - Server health check

### Query Parameters
Each endpoint supports various query parameters for filtering and pagination. See the API service files for detailed parameter documentation.

## 🏗️ Project Structure

```
nasa-space-explorer/
├── src/
│   ├── components/          # React components
│   │   ├── APODSection.jsx
│   │   ├── MarsRoverSection.jsx
│   │   ├── NEOSection.jsx
│   │   ├── ImageLibrarySection.jsx
│   │   ├── Header.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorBoundary.jsx
│   ├── services/           # API service layer
│   │   └── api.js
│   ├── utils/              # Utility functions
│   │   └── dateUtils.js
│   └── App.jsx             # Main application component
├── server/                 # Express.js backend
│   └── index.js
├── .env                    # Environment variables
└── README.md
```

## 🌟 Key Features Breakdown

### Astronomy Picture of the Day
- Daily space imagery with HD downloads
- Date picker for browsing historical images
- Random date exploration
- Favorite system for bookmarking
- Full metadata display including copyright and explanations

### Mars Rover Gallery
- Photos from all active Mars rovers
- Filter by rover, camera type, and Martian day (Sol)
- Grid and list view modes
- Detailed photo metadata
- High-resolution image viewing

### Near Earth Objects
- Real-time asteroid tracking data
- Interactive object selection with detailed orbital information
- Hazardous object highlighting
- Statistical visualizations
- Date range filtering

### NASA Image Library
- Search through thousands of NASA images and videos
- Media type filtering (images, videos, all)
- Infinite scroll loading
- Popular search suggestions
- Detailed metadata modal views

## 🔧 Development

### Available Scripts
- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the React frontend
- `npm run server` - Start only the Express backend
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Environment Variables
```env
NASA_API_KEY=DEMO_KEY          # Replace with your NASA API key
PORT=5000                      # Backend server port
```

### NASA API Key
While the application works with the included `DEMO_KEY`, it has rate limits. For production use:
1. Visit https://api.nasa.gov/
2. Sign up for a free API key
3. Replace `DEMO_KEY` in the `.env` file


## 📄 License
MIT License - feel free to use this project for learning and development purposes.

## 🙏 Acknowledgments
- NASA for providing incredible space data through their open APIs
- The open-source community for the amazing tools and libraries used
- Space enthusiasts who inspire continued exploration



---

**Built with ❤️ for space exploration enthusiasts**

*Journey through the cosmos with real-time NASA data!* 🌌