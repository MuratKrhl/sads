import React from 'react';
import { Bars3Icon, MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  return (
    <header className="bg-white p-4 flex items-center justify-between border-b border-gray-200 flex-shrink-0 z-10">
      {/* Left Side */}
      <div className="flex items-center">
        <button className="text-gray-500 hover:text-gray-700 lg:hidden">
          <Bars3Icon className="h-6 w-6" />
        </button>
        <button className="text-gray-500 hover:text-gray-700 hidden lg:block">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
        </button>
      </div>

      {/* Right Side Icons & Profile */}
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-100">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded-md">⌘K</kbd>
        </button>
        
        <div className="relative">
          <BellIcon className="h-6 w-6 text-gray-500 hover:text-gray-700 cursor-pointer" />
          <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 top-0.5 right-0.5"></span>
          </span>
        </div>

        <div className="flex items-center space-x-3 cursor-pointer">
          <img
            src="https://picsum.photos/seed/user/40/40"
            alt="User Avatar"
            className="h-9 w-9 rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
