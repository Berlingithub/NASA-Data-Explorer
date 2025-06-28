import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animation-delay-150"></div>
      </div>
      <div className="text-white text-lg font-medium">Loading space data...</div>
      <div className="text-gray-400 text-sm">Communicating with NASA APIs</div>
    </div>
  );
};

export default LoadingSpinner;