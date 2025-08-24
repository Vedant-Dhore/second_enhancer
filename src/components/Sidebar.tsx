import React from 'react';
import { Menu } from 'lucide-react';
import { useJob } from '../contexts/JobContext';
import JobCard from './JobCard';
import SearchFilterPanel from './SearchFilterPanel';
import CreateJobModal from './CreateJobModal';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { 
    jobs, 
    addJob,
    selectedJobId, 
    setSelectedJobId,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    getFilteredAndSortedJobs
  } = useJob();

  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const filteredJobs = getFilteredAndSortedJobs();

  if (collapsed) {
    return (
      <div className="p-4">
        <button 
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Jobs</h2>
          <button 
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-sm"
          >
            ADD NEW JOB
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full bg-gradient-to-r from-orange-300 to-orange-400 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-400 hover:to-orange-500 transition-all duration-200 shadow-sm"
          >
            CREATE NEW JOB
          </button>
        </div>
      </div>

      {/* Search, Filter, Sort Panel */}
      <SearchFilterPanel
        searchTerm={searchTerm}
        sortBy={sortBy}
        filters={filters}
        onSearchChange={setSearchTerm}
        onSortChange={setSortBy}
        onFiltersChange={setFilters}
      />

      {/* Job Tabs */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex space-x-4">
          <button className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1">
            My Jobs
          </button>
          <button className="text-sm font-medium text-gray-500 hover:text-gray-700 pb-1">
            All Jobs
          </button>
        </div>
      </div>

      {/* Job List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isSelected={selectedJobId === job.id}
            onClick={() => setSelectedJobId(job.id)}
          />
        ))}
        
        {filteredJobs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No jobs match your search criteria</p>
          </div>
        )}
      </div>

      <CreateJobModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateJob={addJob}
      />
    </div>
  );
};

export default Sidebar;