import React from 'react';
import { Clock, UserPlus, FileText, CheckCircle, XCircle } from 'lucide-react';

interface TimelineItem {
  id: string;
  type: 'candidate_added' | 'status_change' | 'interview_scheduled' | 'offer_sent' | 'rejection';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ComponentType<any>;
  color: string;
}

const ActivityTimeline: React.FC = () => {
  const timelineItems: TimelineItem[] = [
    {
      id: '1',
      type: 'candidate_added',
      title: 'New Candidate Added',
      description: 'Janhavi applied for Intern Software Developer',
      timestamp: '2 hours ago',
      icon: UserPlus,
      color: 'text-blue-600'
    },
    {
      id: '2',
      type: 'status_change',
      title: 'Status Updated',
      description: 'Aarya Ranpise moved to Basic Screening',
      timestamp: '4 hours ago',
      icon: FileText,
      color: 'text-yellow-600'
    },
    {
      id: '3',
      type: 'offer_sent',
      title: 'Offer Sent',
      description: 'Offer sent to candidate for Sr Frontend Developer',
      timestamp: '1 day ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: '4',
      type: 'rejection',
      title: 'Candidate Rejected',
      description: 'Candidate declined offer for Software Developer role',
      timestamp: '2 days ago',
      icon: XCircle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        {timelineItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-start space-x-3">
              <div className={`${item.color} bg-gray-50 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="text-xs text-gray-400 mt-1">{item.timestamp}</p>
              </div>
              {index < timelineItems.length - 1 && (
                <div className="absolute left-7 mt-8 w-px h-4 bg-gray-200"></div>
              )}
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
        View All Activity
      </button>
    </div>
  );
};

export default ActivityTimeline;