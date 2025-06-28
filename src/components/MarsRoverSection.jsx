import React, { useState, useEffect } from 'react';
import { Camera, Filter, Grid, List, ExternalLink } from 'lucide-react';
import { fetchMarsPhotos } from '../services/api';

const MarsRoverSection = ({ setIsLoading }) => {
  const [photos, setPhotos] = useState([]);
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedSol, setSelectedSol] = useState('1000');
  const [viewMode, setViewMode] = useState('grid');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const rovers = [
    { name: 'curiosity', displayName: 'Curiosity', color: 'from-red-500 to-orange-500' },
    { name: 'opportunity', displayName: 'Opportunity', color: 'from-blue-500 to-indigo-500' },
    { name: 'spirit', displayName: 'Spirit', color: 'from-green-500 to-teal-500' }
  ];

  const cameras = [
    { value: '', label: 'All Cameras' },
    { value: 'FHAZ', label: 'Front Hazard Avoidance Camera' },
    { value: 'RHAZ', label: 'Rear Hazard Avoidance Camera' },
    { value: 'MAST', label: 'Mast Camera' },
    { value: 'CHEMCAM', label: 'Chemistry and Camera Complex' },
    { value: 'MAHLI', label: 'Mars Hand Lens Imager' },
    { value: 'MARDI', label: 'Mars Descent Imager' },
    { value: 'NAVCAM', label: 'Navigation Camera' }
  ];

  useEffect(() => {
    loadPhotos();
  }, [selectedRover, selectedCamera, selectedSol]);

  const loadPhotos = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        rover: selectedRover,
        sol: selectedSol,
        page: pageNum
      };
      
      if (selectedCamera) {
        params.camera = selectedCamera;
      }

      const data = await fetchMarsPhotos(params);
      
      if (pageNum === 1) {
        setPhotos(data.photos);
      } else {
        setPhotos(prev => [...prev, ...data.photos]);
      }
      
      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to load Mars rover photos');
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMorePhotos = () => {
    loadPhotos(page + 1);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => loadPhotos()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Rover Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rover</label>
            <select
              value={selectedRover}
              onChange={(e) => setSelectedRover(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-red-400 focus:outline-none"
            >
              {rovers.map(rover => (
                <option key={rover.name} value={rover.name}>{rover.displayName}</option>
              ))}
            </select>
          </div>

          {/* Camera Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Camera</label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-red-400 focus:outline-none"
            >
              {cameras.map(camera => (
                <option key={camera.value} value={camera.value}>{camera.label}</option>
              ))}
            </select>
          </div>

          {/* Sol Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sol (Martian Day)</label>
            <input
              type="number"
              value={selectedSol}
              onChange={(e) => setSelectedSol(e.target.value)}
              min="1"
              max="4000"
              className="w-full bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-red-400 focus:outline-none"
            />
          </div>

          {/* View Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">View</label>
            <div className="flex rounded-lg overflow-hidden border border-white/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 px-3 py-2 flex items-center justify-center space-x-1 transition-colors ${
                  viewMode === 'grid' ? 'bg-red-500 text-white' : 'bg-black/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 px-3 py-2 flex items-center justify-center space-x-1 transition-colors ${
                  viewMode === 'list' ? 'bg-red-500 text-white' : 'bg-black/20 text-gray-300 hover:bg-white/10'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-300">
            <Camera size={16} />
            <span>{photos.length} photos found</span>
          </div>
          
          <button
            onClick={() => {
              const randomSol = Math.floor(Math.random() * 2000) + 1;
              setSelectedSol(randomSol.toString());
            }}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Random Sol
          </button>
        </div>
      </div>

      {/* Photos Grid/List */}
      {photos.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {photos.map((photo, index) => (
            <div
              key={`${photo.id}-${index}`}
              className={`group bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-red-400/50 transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
                <img
                  src={photo.img_src}
                  alt={`Mars photo by ${photo.rover.name} - ${photo.camera.full_name}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-2 right-2">
                    <a
                      href={photo.img_src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-400 capitalize">{photo.rover.name}</span>
                  <span className="text-xs text-gray-400">Sol {photo.sol}</span>
                </div>
                
                <h3 className="text-white font-medium mb-1 line-clamp-2">{photo.camera.full_name}</h3>
                <p className="text-gray-400 text-sm mb-3">{new Date(photo.earth_date).toLocaleDateString()}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Photo #{photo.id}</span>
                  <span className="text-xs text-gray-500 uppercase">{photo.camera.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No photos found for the selected criteria</p>
          <p className="text-gray-500 text-sm mt-2">Try selecting a different rover, camera, or sol date</p>
        </div>
      )}

      {/* Load More Button */}
      {photos.length > 0 && photos.length >= 25 && (
        <div className="text-center">
          <button
            onClick={loadMorePhotos}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Load More Photos
          </button>
        </div>
      )}
    </div>
  );
};

export default MarsRoverSection;