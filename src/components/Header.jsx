import React from 'react';
import { Rocket, Stars } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <div className="relative">
              <Rocket className="w-12 h-12 text-blue-400 transform rotate-45 animate-pulse" />
              <Stars className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-spin" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            NASA Space Explorer
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Journey through the cosmos with real-time data from NASA's Open APIs. 
            Discover stunning imagery, track near-Earth objects, and explore the wonders of space.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Real-time NASA Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span>Interactive Visualizations</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span>Beautiful UI/UX</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;