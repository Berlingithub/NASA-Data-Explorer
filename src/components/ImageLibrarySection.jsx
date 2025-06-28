import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, ExternalLink, Play, Image as ImageIcon } from 'lucide-react';
import { fetchNASAImages } from '../services/api';

const ImageLibrarySection = ({ setIsLoading }) => {
  const [images, setImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('mars');
  const [mediaType, setMediaType] = useState('image');
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const popularSearches = [
    'Mars', 'Jupiter', 'Saturn', 'Nebula', 'Galaxy', 'Space Station', 
    'Astronaut', 'Earth', 'Moon', 'Solar System', 'Hubble', 'Telescope'
  ];

  useEffect(() => {
    searchImages(true);
  }, [searchQuery, mediaType]);

  const searchImages = async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentPage = reset ? 1 : page;
      const data = await fetchNASAImages({
        q: searchQuery,
        media_type: mediaType,
        page: currentPage
      });

      if (data.collection.items.length === 0 && reset) {
        setImages([]);
        setHasMore(false);
      } else {
        const newImages = reset ? data.collection.items : [...images, ...data.collection.items];
        setImages(newImages);
        setPage(reset ? 2 : page + 1);
        setHasMore(data.collection.items.length === 100); // NASA API returns 100 items per page
      }
    } catch (err) {
      setError(err.message || 'Failed to search NASA images');
      if (reset) setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchImages(true);
  };

  const loadMoreImages = () => {
    if (hasMore) {
      searchImages(false);
    }
  };

  const getImageUrl = (item) => {
    return item.links?.[0]?.href;
  };

  const getVideoThumbnail = (item) => {
    return item.links?.[0]?.href;
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => searchImages(true)}
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
      {/* Search Controls */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search NASA images and videos..."
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="bg-black/20 border border-white/20 rounded-lg px-3 py-3 text-white focus:border-purple-400 focus:outline-none"
              >
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="">All Media</option>
              </select>
              
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400 mr-2">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchQuery(term.toLowerCase());
                  setTimeout(() => searchImages(true), 100);
                }}
                className="text-xs bg-white/10 hover:bg-white/20 text-purple-300 px-2 py-1 rounded-full transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Results */}
      {images.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-300">
              <Grid size={16} />
              <span>{images.length} results for "{searchQuery}"</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((item, index) => (
              <div
                key={`${item.data[0].nasa_id}-${index}`}
                className="group bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative aspect-square">
                  {item.data[0].media_type === 'image' ? (
                    <img
                      src={getImageUrl(item)}
                      alt={item.data[0].title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/40 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full capitalize">
                          {item.data[0].media_type}
                        </span>
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-white mb-2 line-clamp-2 text-sm">
                    {item.data[0].title}
                  </h3>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                    {item.data[0].description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(item.data[0].date_created).toLocaleDateString()}</span>
                    <span>ID: {item.data[0].nasa_id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMoreImages}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Load More Results
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No results found</p>
          <p className="text-gray-500 text-sm mt-2">Try searching for different terms like "mars", "jupiter", or "nebula"</p>
        </div>
      )}

      {/* Image Detail Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-white/20">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white truncate">
                {selectedImage.data[0].title}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 max-h-[calc(90vh-80px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  {selectedImage.data[0].media_type === 'image' ? (
                    <img
                      src={getImageUrl(selectedImage)}
                      alt={selectedImage.data[0].title}
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                      <a
                        href={selectedImage.links?.[0]?.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        <Play size={20} />
                        <span>Watch Video</span>
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Description</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedImage.data[0].description}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Date Created:</span>
                      <div className="text-white">{new Date(selectedImage.data[0].date_created).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Media Type:</span>
                      <div className="text-white capitalize">{selectedImage.data[0].media_type}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">NASA ID:</span>
                      <div className="text-white font-mono text-xs">{selectedImage.data[0].nasa_id}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Center:</span>
                      <div className="text-white">{selectedImage.data[0].center || 'N/A'}</div>
                    </div>
                  </div>

                  {selectedImage.data[0].keywords && (
                    <div>
                      <span className="text-gray-400 text-sm">Keywords:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedImage.data[0].keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-white/10 text-purple-300 px-2 py-1 rounded-full text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageLibrarySection;