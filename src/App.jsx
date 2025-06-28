import React, { useState, useEffect } from 'react';
import { Rocket, Image, Globe, Zap, Camera, Search } from 'lucide-react';
import Header from './components/Header';
import APODSection from './components/APODSection';
import MarsRoverSection from './components/MarsRoverSection';
import NEOSection from './components/NEOSection';
import ImageLibrarySection from './components/ImageLibrarySection';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [activeSection, setActiveSection] = useState('apod');
  const [isLoading, setIsLoading] = useState(false);

  const sections = [
    { id: 'apod', name: 'Picture of the Day', icon: Image, color: 'from-blue-500 to-purple-600' },
    { id: 'mars', name: 'Mars Rovers', icon: Camera, color: 'from-red-500 to-orange-600' },
    { id: 'neo', name: 'Near Earth Objects', icon: Globe, color: 'from-green-500 to-teal-600' },
    { id: 'images', name: 'Image Library', icon: Search, color: 'from-purple-500 to-pink-600' }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'apod':
        return <APODSection setIsLoading={setIsLoading} />;
      case 'mars':
        return <MarsRoverSection setIsLoading={setIsLoading} />;
      case 'neo':
        return <NEOSection setIsLoading={setIsLoading} />;
      case 'images':
        return <ImageLibrarySection setIsLoading={setIsLoading} />;
      default:
        return <APODSection setIsLoading={setIsLoading} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Animated background stars */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
        </div>

        <div className="relative z-10">
          <Header />
          
          {/* Navigation */}
          <nav className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center space-x-1 py-4 overflow-x-auto">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                        activeSection === section.id
                          ? `bg-gradient-to-r ${section.color} text-white shadow-lg transform scale-105`
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{section.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isLoading && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
            {renderActiveSection()}
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;