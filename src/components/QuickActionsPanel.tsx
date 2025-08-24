import React from 'react';
import { FileText, Brain, Highlighter, Zap } from 'lucide-react';
import ResumeEnhancer from './ResumeEnhancer';

const QuickActionsPanel: React.FC = () => {
  const [showResumeEnhancer, setShowResumeEnhancer] = React.useState(false);

  const quickActions = [
    {
      id: '1',
      title: 'Resume Enhancer',
      description: 'AI-powered suggestions to improve candidate-JD fitment',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: '2',
      title: 'AI-powered Fitment Report',
      description: 'Analyze candidate-job compatibility',
      icon: Brain,
      color: 'bg-purple-500 hover:bg-purple-600',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      id: '3',
      title: 'Resume Highlights Extractor',
      description: 'Extract key skills and achievements',
      icon: Highlighter,
      color: 'bg-green-500 hover:bg-green-600',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        <Zap className="w-5 h-5 text-orange-500" />
      </div>
      
      <div className="space-y-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          const handleClick = () => {
            if (action.id === '1') {
              setShowResumeEnhancer(true);
            }
          };
          
          return (
            <button
              key={action.id}
              onClick={handleClick}
              className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
            >
              <div className={`${action.iconBg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                <Icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 text-sm group-hover:text-gray-700">
                  {action.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full bg-gradient-to-r from-orange-400 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-sm text-sm">
          Run All AI Actions
        </button>
      </div>
      
      {showResumeEnhancer && (
        <ResumeEnhancer onClose={() => setShowResumeEnhancer(false)} />
      )}
    </div>
  );
};

export default QuickActionsPanel;