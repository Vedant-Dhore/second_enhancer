import React from 'react';
import { Users, UserCheck, Clock, Send, TrendingUp } from 'lucide-react';
import { useJob } from '../contexts/JobContext';

const JobOverviewWidget: React.FC = () => {
  const { getSelectedJob } = useJob();
  const selectedJob = getSelectedJob();

  if (!selectedJob) return null;

  const stats = [
    {
      label: 'Total Candidates',
      value: selectedJob.totalCandidates,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Shortlisted',
      value: selectedJob.shortlisted,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'In Screening',
      value: selectedJob.inScreening,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Offers Sent',
      value: selectedJob.offersSent,
      icon: Send,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Job Overview</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Last updated {selectedJob.lastUpdated}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div className={`${stat.bgColor} ${stat.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Hiring Progress</span>
          <span>{selectedJob.totalCandidates > 0 ? Math.round((selectedJob.offersSent / selectedJob.totalCandidates) * 100) : 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-400 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: selectedJob.totalCandidates > 0 
                ? `${(selectedJob.offersSent / selectedJob.totalCandidates) * 100}%` 
                : '0%' 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default JobOverviewWidget;