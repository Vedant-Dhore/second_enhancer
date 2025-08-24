import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            <span className="text-black">Meet</span>
            <span className="text-orange-500">Aiva</span>
            <span className="text-black">.in</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Hello!</span>
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                V
              </div>
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                Vedant Dhore
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;