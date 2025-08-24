import React from 'react';
import { Edit2, Building2, Clock, DollarSign, Briefcase, HelpCircle } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  location: string;
  workType: string;
  status: 'active' | 'paused' | 'closed';
  candidateCount: number;
  experience: string;
  experienceRequired: string;
  employment: string;
  budget: string;
  budgetRange?: string;
  industry: string;
  postedDate: string;
  description: string;
  qualifications: { text: string; mandatory: boolean }[];
  skills: string[];
  recruiterNotes: string;
  totalCandidates: number;
  shortlisted: number;
  inScreening: number;
  offersSent: number;
  lastUpdated: string;
}

interface JobInformationProps {
  job: Job;
}

const JobInformation: React.FC<JobInformationProps> = ({ job }) => {
  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Building2 className="w-8 h-8 text-gray-400" />
            <div>
              <h2 className="text-lg font-medium text-gray-900">N/A</h2>
              <p className="text-sm text-gray-500">{job.workType}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              <Edit2 className="w-4 h-4" />
              <span>EDIT</span>
            </button>
          </div>
        </div>

        <div className="text-right text-sm text-gray-500">
          <p>Posted {job.postedDate} • {job.candidateCount} Applicants</p>
          <p className="text-blue-500 hover:underline cursor-pointer">
            Upload Custom Skill Document (.*.pdf, *.docx)
          </p>
        </div>
      </div>

      {/* Job Details Grid */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">EXPERIENCE (Years)</span>
          </div>
          <p className="text-gray-600">{job.experience}</p>
          <p className="text-xs text-gray-500 mt-1">Required: {job.experienceRequired}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">EMPLOYMENT</span>
          </div>
          <p className="text-gray-600">{job.employment}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-2 mb-2 group">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">ESTIMATED SALARY</span>
            <div className="relative">
              <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                Salary range or hiring budget
              </div>
            </div>
          </div>
          <p className="text-gray-600">
            {job.budgetRange || job.budget}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">INDUSTRY</span>
          </div>
          <p className="text-gray-600">{job.industry}</p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview</h3>
        <p className="text-gray-700 leading-relaxed">{job.description}</p>
      </div>

      {/* Job Description Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
        
        {/* Qualifications */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Qualification Ask</h4>
            <span className="text-sm text-gray-500">Mandatory?</span>
          </div>
          
          <div className="space-y-3">
            {job.qualifications.map((qual, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">{qual.text}</span>
                <div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center">
                  {qual.mandatory && <div className="w-3 h-3 bg-green-500 rounded"></div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Uploaded Custom Skills */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-4">Uploaded Custom Skills File List</h4>
          <p className="text-gray-500">No files uploaded yet.</p>
        </div>

        {/* Recruiter Notes */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Recruiter Notes</h4>
          <p className="text-gray-500">
            {job.recruiterNotes || 'No recruiter notes available.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobInformation;