import React, { useState } from 'react';
import { JobProvider } from '../contexts/JobContext';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <JobProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200`}>
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Header />
          <MainContent />
        </div>
      </div>
    </JobProvider>
  );
};

export default Dashboard;