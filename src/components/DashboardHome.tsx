import React from 'react';
import { 
  Briefcase, 
  Users, 
  Calendar,
  Plus,
  Upload,
  Send,
  CalendarCheck,
  Circle
} from 'lucide-react';
import NeedsAttention from './NeedsAttention';

const DashboardHome: React.FC = () => {
  // Mock data for the dashboard
  const stats = [
    {
      title: 'Job Vacancies',
      value: '24',
      growth: '+12%',
      icon: Briefcase,
      color: 'bg-blue-500',
      growthColor: 'text-green-600 bg-green-100'
    },
    {
      title: 'Jobs Filled',
      value: '17',
      growth: '+8%',
      icon: Users,
      color: 'bg-green-500',
      growthColor: 'text-green-600 bg-green-100'
    },
    {
      title: 'Conversion Rate',
      value: '68%',
      growth: '+5%',
      icon: Users,
      color: 'bg-orange-500',
      growthColor: 'text-green-600 bg-green-100'
    },
    {
      title: 'Offer Acceptance Rate',
      value: '85%',
      growth: '+3%',
      icon: Users,
      color: 'bg-red-500',
      growthColor: 'text-green-600 bg-green-100'
    }
  ];

  const candidateStats = [
    {
      title: 'Total Candidates',
      value: '234',
      breakdown: {
        fitment: 111,
        basicScreening: 78,
        technical: 45
      },
      growth: '+15%',
      icon: Users,
      color: 'bg-purple-500',
      growthColor: 'text-green-600 bg-green-100'
    }
  ];



  const quickActions = [
    {
      title: 'Create New Job',
      icon: Plus,
      primary: true
    },
    {
      title: 'Bulk Import Candidates',
      icon: Upload,
      primary: false
    },
    {
      title: 'Send Bulk Messages',
      icon: Send,
      primary: false
    },
    {
      title: 'Schedule Interviews',
      icon: CalendarCheck,
      primary: false
    }
  ];

  const recentActivity = [
    {
      text: 'New application for Software Developer',
      color: 'text-green-500'
    },
    {
      text: 'Interview completed for Intern role',
      color: 'text-orange-500'
    },
    {
      text: 'Job posting updated',
      color: 'text-blue-500'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruiter Dashboard</h1>
        <p className="text-gray-600">Manage your jobs, track candidates, and streamline your hiring process with AI-powered insights.</p>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`${stat.growthColor} px-2 py-1 rounded-full text-xs font-medium`}>
                  {stat.growth}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Total Candidates Card with Breakdown */}
      <div className="grid grid-cols-1 mb-8">
        {candidateStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`${stat.growthColor} px-2 py-1 rounded-full text-xs font-medium`}>
                  {stat.growth}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mb-3">{stat.value}</p>
              <div className="text-xs text-gray-500 space-y-1">
                <div>Fitment: {stat.breakdown.fitment}</div>
                <div>Basic Screening: {stat.breakdown.basicScreening}</div>
                <div>Technical: {stat.breakdown.technical}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Needs Attention */}
        <NeedsAttention />

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h2>
          <p className="text-sm text-gray-600 mb-6">Streamline your workflow</p>
          
          <div className="space-y-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    action.primary
                      ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:from-orange-500 hover:to-pink-600 shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{action.title}</span>
                </button>
              );
            })}
          </div>
          
          {/* Recently Active */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">Recently Active</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Circle className={`w-2 h-2 ${activity.color} fill-current`} />
                  <span className="text-sm text-gray-600">{activity.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;