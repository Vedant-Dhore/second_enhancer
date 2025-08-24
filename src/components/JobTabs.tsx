import React from 'react';
import { useJob } from '../contexts/JobContext';

const JobTabs: React.FC = () => {
  const { selectedTab, setSelectedTab, selectedJobId, getCandidatesForJob } = useJob();
  
  const candidateCount = selectedJobId ? getCandidatesForJob(selectedJobId).length : 0;

  const tabs = [
    { id: 'information', label: 'Information' },
    { id: 'candidates', label: 'Candidates' },
    { id: 'persona', label: 'Persona' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              selectedTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
            {tab.id === 'candidates' && candidateCount > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                {candidateCount}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default JobTabs;