import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useJob } from '../contexts/JobContext';
import DashboardHome from './DashboardHome';
import JobTabs from './JobTabs';
import JobInformation from './JobInformation';
import CandidatesKanban from './CandidatesKanban';
import PersonaTab from './PersonaTab';
import JobOverviewWidget from './JobOverviewWidget';
import QuickActionsPanel from './QuickActionsPanel';

const MainContent: React.FC = () => {
  const { selectedTab, getSelectedJob, setSelectedJobId } = useJob();
  const selectedJob = getSelectedJob();

  if (!selectedJob) {
    return <DashboardHome />;
  }

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'information':
        return <JobInformation job={selectedJob} />;
      case 'candidates':
        return <CandidatesKanban />;
      case 'persona':
        return <PersonaTab />;
      default:
        return <JobInformation job={selectedJob} />;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      {/* Job Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSelectedJobId(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <h1 className="text-xl font-semibold text-gray-900">{selectedJob.title}</h1>
          </div>
          <button className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-sm">
            ADD CANDIDATES
          </button>
        </div>
      </div>

      {/* Tabs */}
      <JobTabs />

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto flex">
        <div className="flex-1">
          {renderTabContent()}
        </div>
        
        {/* Right Sidebar with Widgets */}
        <div className="w-80 p-6 space-y-6 bg-gray-50 border-l border-gray-200">
          <JobOverviewWidget />
          <QuickActionsPanel />
        </div>
      </div>
    </div>
  );
};

export default MainContent;