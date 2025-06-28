import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Heart, Share2, Download } from 'lucide-react';
import { formatDate, getDateDaysAgo } from '../utils/dateUtils';
import { fetchAPOD } from '../services/api';

const APODSection = ({ setIsLoading }) => {
  const [apodData, setApodData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadAPOD(selectedDate);
  }, [selectedDate]);

  const loadAPOD = async (date) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAPOD({ date });
      setApodData(data);
    } catch (err) {
      setError(err.message || 'Failed to load Astronomy Picture of the Day');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = () => {
    const isCurrentlyFavorite = favorites.includes(apodData.date);
    if (isCurrentlyFavorite) {
      setFavorites(favorites.filter(date => date !== apodData.date));
    } else {
      setFavorites([...favorites, apodData.date]);
    }
  };

  const getRandomDate = () => {
    const randomDays = Math.floor(Math.random() * 365 * 10); // Random date within last 10 years
    const randomDate = getDateDaysAgo(randomDays);
    setSelectedDate(formatDate(randomDate));
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => loadAPOD(selectedDate)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!apodData) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Calendar className="w-5 h-5 text-blue-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={formatDate(new Date())}
              className="bg-black/20 border border-white/20 rounded-lg px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={getRandomDate}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Random Date
            </button>
            <button
              onClick={() => setSelectedDate(formatDate(new Date()))}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image/Video */}
        <div className="space-y-4">
          <div className="relative group rounded-xl overflow-hidden bg-black/20 backdrop-blur-md border border-white/10">
            {apodData.media_type === 'image' ? (
              <img
                src={apodData.hdurl || apodData.url}
                alt={apodData.title}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="aspect-video">
                <iframe
                  src={apodData.url}
                  title={apodData.title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
            
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full backdrop-blur-md border transition-colors ${
                      favorites.includes(apodData.date)
                        ? 'bg-red-500/20 border-red-400 text-red-400'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart size={18} fill={favorites.includes(apodData.date) ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
                
                {apodData.media_type === 'image' && (
                  <a
                    href={apodData.hdurl || apodData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
                  >
                    <Download size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-white leading-tight">{apodData.title}</h2>
              {apodData.copyright && (
                <span className="text-sm text-gray-400 ml-4">© {apodData.copyright}</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <Calendar size={16} className="text-blue-400" />
              <span className="text-gray-300">{new Date(apodData.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6">{apodData.explanation}</p>

            {apodData.hdurl && (
              <a
                href={apodData.hdurl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <ExternalLink size={16} />
                <span>View HD Image</span>
              </a>
            )}
          </div>

          {/* Quick Navigation */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedDate(formatDate(getDateDaysAgo(1)))}
                className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                <div className="text-sm text-gray-400">Yesterday</div>
                <div className="text-white font-medium">{getDateDaysAgo(1).toLocaleDateString()}</div>
              </button>
              <button
                onClick={() => setSelectedDate(formatDate(getDateDaysAgo(7)))}
                className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                <div className="text-sm text-gray-400">Last Week</div>
                <div className="text-white font-medium">{getDateDaysAgo(7).toLocaleDateString()}</div>
              </button>
              <button
                onClick={() => setSelectedDate(formatDate(getDateDaysAgo(30)))}
                className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                <div className="text-sm text-gray-400">Last Month</div>
                <div className="text-white font-medium">{getDateDaysAgo(30).toLocaleDateString()}</div>
              </button>
              <button
                onClick={() => setSelectedDate(formatDate(getDateDaysAgo(365)))}
                className="text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
              >
                <div className="text-sm text-gray-400">Last Year</div>
                <div className="text-white font-medium">{getDateDaysAgo(365).toLocaleDateString()}</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APODSection;