import React from 'react';
import { AlertTriangle, Clock, XCircle, TrendingDown, ChevronRight } from 'lucide-react';

const NeedsAttention: React.FC = () => {
  const attentionItems = [
    {
      id: '1',
      type: 'aging_postings',
      title: 'Oldest Aging Job Postings',
      icon: AlertTriangle,
      iconColor: 'text-orange-600 bg-orange-50',
      items: [
        {
          title: 'Software Developer',
          description: 'Open for 35 days',
          action: 'Review',
          actionColor: 'bg-blue-600 hover:bg-blue-700'
        }
      ]
    },
    {
      id: '2',
      type: 'high_priority_no_movement',
      title: 'High Priority Roles - No Movement',
      icon: AlertTriangle,
      iconColor: 'text-red-600 bg-red-50',
      items: [
        {
          title: 'Test Engineer',
          description: 'No activity in last 7 days',
          action: 'Review',
          actionColor: 'bg-red-600 hover:bg-red-700'
        },
        {
          title: 'Intern Software Developer',
          description: 'No activity in last 7 days',
          action: 'Review',
          actionColor: 'bg-red-600 hover:bg-red-700'
        }
      ]
    },
    {
      id: '3',
      type: 'interviews_no_feedback',
      title: 'Interviews Scheduled - No Response',
      icon: Clock,
      iconColor: 'text-blue-600 bg-blue-50',
      items: [
        {
          title: 'Aarya Ranpise',
          description: 'Interview: Yesterday, 3:00 PM',
          action: 'Send Reminder',
          actionColor: 'bg-blue-600 hover:bg-blue-700'
        }
      ]
    },
    {
      id: '4',
      type: 'candidates_stuck',
      title: 'Candidates Stuck in Pipeline',
      icon: Clock,
      iconColor: 'text-yellow-600 bg-yellow-50',
      items: [
        {
          title: 'Janhavi Sharma',
          description: 'Stuck in Fitment stage for 5 days',
          action: 'Move Forward',
          actionColor: 'bg-green-600 hover:bg-green-700'
        }
      ]
    },
    {
      id: '5',
      type: 'offer_no_response',
      title: 'Offer Extended - No Response',
      icon: XCircle,
      iconColor: 'text-purple-600 bg-purple-50',
      items: [
        {
          title: 'Rahul Patel',
          description: 'Offer sent 4 days ago, no response',
          action: 'Nudge Candidate',
          actionColor: 'bg-purple-600 hover:bg-purple-700'
        }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Needs Attention</h2>
      </div>
      
      <div className="space-y-6">
        {attentionItems.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.id}>
              <div className="flex items-center space-x-2 mb-3">
                <div className={`${section.iconColor} w-6 h-6 rounded-full flex items-center justify-center`}>
                  <Icon className="w-3 h-3" />
                </div>
                <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
              </div>
              
              <div className="space-y-2 ml-8">
                {section.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                    <button className={`${item.actionColor} text-white px-3 py-1 rounded text-xs font-medium transition-colors`}>
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NeedsAttention;