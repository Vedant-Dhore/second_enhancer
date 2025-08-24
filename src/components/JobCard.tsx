import React from 'react';

interface Job {
  id: string;
  title: string;
  location: string;
  workType: string;
  status: 'active' | 'paused' | 'closed';
  candidateCount: number;
  priority?: 'high' | 'medium' | 'low';
  employment: string;
  hiringManager?: string;
}

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, isSelected, onClick }) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityText = (priority?: string) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return '';
    }
  };

  const getPriorityTextColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border bg-white hover:shadow-md ${
        isSelected 
          ? 'border-blue-500 shadow-md' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {/* Header with title and priority dot */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-base leading-tight flex-1 pr-2">
          {job.title}
        </h3>
        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${getPriorityColor(job.priority)}`} />
      </div>
      
      {/* Location */}
      <div className="text-sm text-gray-600 mb-1">
        {job.location}
      </div>
      
      {/* Priority text */}
      <div className={`text-sm font-medium mb-2 ${getPriorityTextColor(job.priority)}`}>
        {getPriorityText(job.priority)}
      </div>
      
      {/* Candidates count */}
      <div className="text-sm text-gray-600 mb-2">
        {job.candidateCount} candidates
      </div>
      
      {/* Work type */}
      <div className="text-sm text-gray-500 mb-2">
        {job.workType}
      </div>
      
      {/* Hiring manager */}
      <div className="text-sm text-gray-600 mb-1">
        {job.hiringManager}
      </div>
      
      {/* Employment type */}
      <div className="text-sm text-gray-500">
        {job.employment}
      </div>
    </div>
  );
};

export default JobCard;