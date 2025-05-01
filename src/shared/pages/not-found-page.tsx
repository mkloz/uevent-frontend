import { useEffect, useState } from 'react';

import { Logo } from '../../assets/logos/logo';

const TERMINAL_MESSAGES = [
  'Searching for page...',
  'Error: Page not found (404)',
  'Coordinates invalid. Recalculating...',
  'System recommendation: Return to main map'
];
export const NotFoundPage = () => {
  const [pinPosition, setPinPosition] = useState({ x: 50, y: 40 });
  const [searchRadius, setSearchRadius] = useState(0);

  // Random movement for the "lost" pin
  useEffect(() => {
    const interval = setInterval(() => {
      setPinPosition({
        x: 40 + Math.random() * 20,
        y: 40 + Math.random() * 20
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Initial animations
  useEffect(() => {
    setTimeout(() => {
      setSearchRadius(30);
    }, 500);
  }, []);

  return (
    <div className="max-h-screen-no-header min-h-full flex flex-col items-center justify-center">
      <div className="w-full rounded-2xl overflow-hidden h-full">
        {/* Map area */}
        <div className="relative min-h-80 h-screen-no-header w-full bg-gray-100 overflow-hidden">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-300 mb-2 text-center">Oops! You seem to be lost</h1>
          {/* Map grid */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`col-${i}`} className="border-r border-gray-200 h-full"></div>
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`row-${i}`} className="border-b border-gray-200 w-full"></div>
            ))}
          </div>

          {/* Random "roads" */}
          <div className="absolute top-1/4 left-0 w-full h-[5px] bg-gray-300 transform -rotate-3"></div>
          <div className="absolute top-2/3 left-0 w-full h-[5px] bg-gray-300 transform rotate-2"></div>
          <div className="absolute top-0 left-1/3 w-[5px] h-full bg-gray-300 transform rotate-1"></div>
          <div className="absolute top-0 left-2/3 w-[5px] h-full bg-gray-300 transform -rotate-1"></div>

          {/* Glitchy map elements */}
          <div className="absolute top-[10%] right-[20%] w-[60px] h-[30px] bg-red-200 opacity-80 animate-pulse"></div>
          <div
            className="absolute top-[60%] left-[35%] w-[80px] h-[40px] bg-blue-200 opacity-60 animate-pulse"
            style={{ animationDuration: '3s' }}></div>
          <div
            className="absolute top-[30%] left-[15%] w-[40px] h-[40px] bg-green-200 opacity-70 animate-pulse"
            style={{ animationDuration: '4s' }}></div>

          {/* Glitched text */}
          <div className="absolute top-[15%] left-[20%] font-mono text-xs text-gray-400 transform rotate-3">
            err_location_404
          </div>
          <div className="absolute top-[70%] right-[15%] font-mono text-xs text-gray-400 transform -rotate-1">
            page_not_found
          </div>
          <div className="absolute top-[45%] right-[30%] font-mono text-xs text-gray-400 transform rotate-1">
            location_unknown
          </div>

          {/* Search radius animation */}

          <div
            className="absolute rounded-full border-2 border-dashed border-indigo-600 opacity-30 transition-all duration-3000 transform -translate-1/2"
            style={{
              top: `${pinPosition.y}%`,
              left: `${pinPosition.x}%`,
              width: `${searchRadius * 2}%`,
              height: `${searchRadius * 2}%`
            }}></div>
          <div className="absolute text-[12rem] text-gray-300 top-1/2 left-1/2 transform -translate-1/2">404</div>

          {/* "Lost" pin */}
          <div
            className={`absolute transition-all duration-1000 'animate-bounce`}
            style={{
              top: `${pinPosition.y}%`,
              left: `${pinPosition.x}%`,
              transform: 'translate(-50%, -50%)'
            }}>
            <div className="relative">
              <Logo className="size-16" />
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 flex items-center justify-center">
                <span className="text-white font-bold text-xl bg-[#4F46E5] px-2 py-1 rounded-full">?</span>
              </div>
            </div>

            {/* Glitch effect */}
            <div className="absolute inset-0 w-full h-full opacity-30 animate-ping" style={{ animationDuration: '3s' }}>
              <Logo className="size-16 " fill="#EF4444" />
            </div>
          </div>

          {/* Alert terminal */}
          <div className="absolute bottom-4 left-4 bg-black/80 rounded-lg p-3 font-mono text-sm text-green-400 flex flex-col space-y-1 overflow-hidden">
            {TERMINAL_MESSAGES.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
