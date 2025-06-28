import React, { useState, useEffect } from 'react';
import { Globe, AlertTriangle, TrendingUp, Calendar, Zap } from 'lucide-react';
import { formatDate, getDateDaysAgo } from '../utils/dateUtils';
import { fetchNEO } from '../services/api';

const NEOSection = ({ setIsLoading }) => {
  const [neoData, setNeoData] = useState(null);
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(getDateDaysAgo(-7)));
  const [selectedObject, setSelectedObject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNEOData();
  }, [startDate, endDate]);

  const loadNEOData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchNEO({ start_date: startDate, end_date: endDate });
      setNeoData(data);
    } catch (err) {
      setError(err.message || 'Failed to load Near Earth Objects data');
    } finally {
      setIsLoading(false);
    }
  };

  const getAllObjects = () => {
    if (!neoData?.near_earth_objects) return [];
    
    const allObjects = [];
    Object.values(neoData.near_earth_objects).forEach(dateObjects => {
      allObjects.push(...dateObjects);
    });
    
    return allObjects.sort((a, b) => 
      parseFloat(b.estimated_diameter.kilometers.estimated_diameter_max) - 
      parseFloat(a.estimated_diameter.kilometers.estimated_diameter_max)
    );
  };

  const getStats = () => {
    const objects = getAllObjects();
    const hazardous = objects.filter(obj => obj.is_potentially_hazardous_asteroid);
    const avgDiameter = objects.reduce((sum, obj) => 
      sum + parseFloat(obj.estimated_diameter.kilometers.estimated_diameter_max), 0) / objects.length;
    
    return {
      total: objects.length,
      hazardous: hazardous.length,
      avgDiameter: avgDiameter.toFixed(2),
      largest: objects[0]
    };
  };

  const formatDistance = (distance) => {
    const km = parseFloat(distance);
    if (km > 1000000) {
      return `${(km / 1000000).toFixed(2)}M km`;
    }
    return `${km.toLocaleString()} km`;
  };

  const formatVelocity = (velocity) => {
    return `${parseFloat(velocity).toFixed(2)} km/s`;
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={loadNEOData}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!neoData) return null;

  const stats = getStats();
  const allObjects = getAllObjects();

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-green-400" />
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={formatDate(new Date())}
                className="bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={formatDate(getDateDaysAgo(-1))}
                className="bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-green-400 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setStartDate(formatDate(getDateDaysAgo(7)));
                setEndDate(formatDate(new Date()));
              }}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => {
                setStartDate(formatDate(new Date()));
                setEndDate(formatDate(getDateDaysAgo(-7)));
              }}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Next 7 Days
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md rounded-xl p-6 border border-blue-400/30">
          <div className="flex items-center justify-between mb-4">
            <Globe className="w-8 h-8 text-blue-400" />
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.total}</div>
          <div className="text-blue-300 text-sm">Total Objects</div>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-md rounded-xl p-6 border border-red-400/30">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">HAZARDOUS</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.hazardous}</div>
          <div className="text-red-300 text-sm">Potentially Hazardous</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-md rounded-xl p-6 border border-green-400/30">
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-green-400" />
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">AVG</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.avgDiameter}</div>
          <div className="text-green-300 text-sm">km Diameter</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-xl p-6 border border-purple-400/30">
          <div className="flex items-center justify-between mb-4">
            <Globe className="w-8 h-8 text-purple-400" />
            <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">MAX</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {stats.largest ? stats.largest.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2) : 0}
          </div>
          <div className="text-purple-300 text-sm">km Largest</div>
        </div>
      </div>

      {/* Objects List */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white">Near Earth Objects</h3>
          <p className="text-gray-400">Click on any object to view detailed information</p>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {allObjects.map((object, index) => (
            <div
              key={object.id}
              onClick={() => setSelectedObject(object)}
              className="p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-white">{object.name}</h4>
                    {object.is_potentially_hazardous_asteroid && (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    Diameter: {object.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {object.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-white">
                    {formatDistance(object.close_approach_data[0].miss_distance.kilometers)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatVelocity(object.close_approach_data[0].relative_velocity.kilometers_per_second)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Object Details */}
      {selectedObject && (
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{selectedObject.name}</h3>
              <div className="flex items-center space-x-4">
                {selectedObject.is_potentially_hazardous_asteroid && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Potentially Hazardous
                  </span>
                )}
                <span className="text-gray-400">NEO Reference ID: {selectedObject.neo_reference_id}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedObject(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Physical Characteristics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated Diameter:</span>
                    <span className="text-white">
                      {selectedObject.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {selectedObject.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Absolute Magnitude:</span>
                    <span className="text-white">{selectedObject.absolute_magnitude_h}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Close Approach Data</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Approach Date:</span>
                    <span className="text-white">{new Date(selectedObject.close_approach_data[0].close_approach_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Miss Distance:</span>
                    <span className="text-white">{formatDistance(selectedObject.close_approach_data[0].miss_distance.kilometers)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Relative Velocity:</span>
                    <span className="text-white">{formatVelocity(selectedObject.close_approach_data[0].relative_velocity.kilometers_per_second)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Orbiting Body:</span>
                    <span className="text-white">{selectedObject.close_approach_data[0].orbiting_body}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Orbital Data</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Orbit ID:</span>
                    <span className="text-white">{selectedObject.orbital_data?.orbit_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Orbit Class:</span>
                    <span className="text-white">{selectedObject.orbital_data?.orbit_class?.orbit_class_type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">First Observation:</span>
                    <span className="text-white">{selectedObject.orbital_data?.first_observation_date || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Observation:</span>
                    <span className="text-white">{selectedObject.orbital_data?.last_observation_date || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {selectedObject.orbital_data?.orbit_class && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Classification</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedObject.orbital_data.orbit_class.orbit_class_description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NEOSection;