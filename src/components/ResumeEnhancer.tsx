import React, { useState, useEffect } from 'react';
import { X, Wand2, Sparkles, TrendingUp, CheckCircle, ArrowRight, ExternalLink, FileText } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  jobId: string;
  stage: string;
  matchPercentage?: number;
  status: string;
  avatar?: string;
  skills: string[];
  fitmentScore: number;
  fitmentSummary: string;
  profileImage: string;
  statusColor: string;
}

interface ResumeEnhancerProps {
  candidate?: Candidate;
  onSave?: (candidateId: string, newScore: number, enhancedResume?: any) => void;
  onClose: () => void;
}

const ResumeEnhancer: React.FC<ResumeEnhancerProps> = ({ candidate, onSave, onClose }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [enhancementProgress, setEnhancementProgress] = useState(0);
  const [enhancedSkills, setEnhancedSkills] = useState<string[]>([]);
  const [projectImprovements, setProjectImprovements] = useState<{ [key: string]: string }>({});
  const [projectLinks, setProjectLinks] = useState<{ [key: string]: string }>({});

  // Get resume data for the candidate
  const getResumeData = () => {
    if (!candidate) return null;
    
    const candidateResumes: { [key: string]: any } = {
      '1': {
        name: "Janhavi Sharma",
        projects: [
          "Blood Bank Management System - Java application with database integration",
          "E-commerce Website - Frontend development with responsive design"
        ],
        skills: ["Java", "React", "SQL"],
        missingSkills: ["Git", "Version Control"]
      },
      '2': {
        name: "Aarya Ranpise", 
        projects: [
          "Library Management System - Python Django application",
          "Personal Portfolio Website - Frontend development with responsive design"
        ],
        skills: ["Python", "Django", "HTML", "CSS"],
        missingSkills: ["React", "Modern Frontend Frameworks"]
      },
      '3': {
        name: "Priya Patel",
        projects: [
          "Library Management System - Python Django application", 
          "Personal Portfolio Website - Frontend development with responsive design"
        ],
        skills: ["Python", "Django", "HTML", "CSS"],
        missingSkills: ["React", "Modern Frontend Frameworks"]
      },
      '4': {
        name: "Rahul Singh",
        projects: [
          "Chat Application - Real-time messaging using Node.js and Socket.io",
          "E-commerce Website - Full-stack development with responsive design"
        ],
        skills: ["JavaScript", "Node.js", "MongoDB"],
        missingSkills: ["SQL", "Relational Databases"]
      },
      '5': {
        name: "Anita Desai",
        projects: [
          "Weather App - React application with API integration",
          "Portfolio Website - Frontend development with modern design"
        ],
        skills: ["React", "JavaScript", "CSS", "HTML"],
        missingSkills: ["Backend Development", "Database Management"]
      },
      '6': {
        name: "Vikram Kumar",
        projects: [
          "Chat Application - Real-time messaging using Node.js and Socket.io",
          "E-commerce Website - Full-stack development with responsive design"
        ],
        skills: ["JavaScript", "Node.js", "MongoDB"],
        missingSkills: ["SQL", "Relational Databases"]
      }
    };

    return candidateResumes[candidate.id] || candidateResumes['1'];
  };

  const resumeData = getResumeData();

  const enhancementSteps = [
    "Analyzing current resume...",
    "Identifying skill gaps...",
    "Generating improvement suggestions...",
    "Optimizing project descriptions...",
    "Calculating new fitment score..."
  ];

  const startEnhancement = () => {
    setIsEnhancing(true);
    setCurrentStep(0);
    setEnhancementProgress(0);

    const interval = setInterval(() => {
      setEnhancementProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsEnhancing(false);
          
          // Generate enhanced skills
          const currentSkills = candidate?.skills || resumeData?.skills || [];
          const missingSkills = resumeData?.missingSkills || [];
          const newSkills = [...currentSkills, ...missingSkills];
          setEnhancedSkills(newSkills);
          
          return 100;
        }
        
        const newProgress = prev + 2;
        const stepIndex = Math.floor(newProgress / 20);
        setCurrentStep(Math.min(stepIndex, enhancementSteps.length - 1));
        
        return newProgress;
      });
    }, 100);
  };

  const handleSave = () => {
    if (!candidate || !onSave) return;
    
    const newFitmentScore = Math.min(candidate.fitmentScore + 15, 95);
    
    const enhancedResume = {
      ...resumeData,
      skills: enhancedSkills,
      projectImprovements,
      projectLinks,
      enhancementDate: new Date().toISOString()
    };
    
    onSave(candidate.id, newFitmentScore, enhancedResume);
    onClose();
  };

  const handleProjectImprovementChange = (projectIndex: number, improvement: string) => {
    setProjectImprovements(prev => ({
      ...prev,
      [projectIndex]: improvement
    }));
  };

  const handleProjectLinkChange = (projectIndex: number, link: string) => {
    setProjectLinks(prev => ({
      ...prev,
      [projectIndex]: link
    }));
  };

  if (!resumeData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Resume Data</h2>
            <p className="text-gray-600 mb-4">Please select a candidate to enhance their resume.</p>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Wand2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Enhancer</h1>
              <p className="text-gray-600">{resumeData.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isEnhancing && enhancedSkills.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">AI-Powered Resume Enhancement</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Our AI will analyze the resume against the job requirements and suggest improvements to increase the fitment score.
              </p>
              <button
                onClick={startEnhancement}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg flex items-center space-x-2 mx-auto"
              >
                <Wand2 className="w-5 h-5" />
                <span>Start Enhancement</span>
              </button>
            </div>
          )}

          {isEnhancing && (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Sparkles className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Enhancing Resume...</h2>
              <p className="text-gray-600 mb-8">{enhancementSteps[currentStep]}</p>
              
              <div className="max-w-md mx-auto mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{enhancementProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${enhancementProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {!isEnhancing && enhancedSkills.length > 0 && (
            <div className="space-y-8">
              {/* Enhancement Results Header */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">Enhancement Complete!</h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Fitment Score</p>
                    <div className="text-2xl font-bold text-gray-900">{candidate?.fitmentScore || 0}%</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Projected Fitment Score</p>
                    <div className="text-2xl font-bold text-green-600 flex items-center space-x-2">
                      <span>{Math.min((candidate?.fitmentScore || 0) + 15, 95)}%</span>
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Enhancement */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Enhancement</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Current Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {(candidate?.skills || resumeData?.skills || []).map((skill: string, index: number) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Enhanced Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {enhancedSkills.map((skill: string, index: number) => {
                        const isNew = !(candidate?.skills || resumeData?.skills || []).includes(skill);
                        return (
                          <span 
                            key={index} 
                            className={`px-3 py-1 rounded-full text-sm ${
                              isNew 
                                ? 'bg-green-100 text-green-800 border border-green-300' 
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {skill}
                            {isNew && <span className="ml-1 text-xs">✨</span>}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Enhancements */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Enhancements</h3>
                <div className="space-y-6">
                  {resumeData.projects.map((project: string, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">{project}</h4>
                      
                      {/* Project Improvement Suggestions */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Suggested Improvements
                        </label>
                        <textarea
                          value={projectImprovements[index] || ''}
                          onChange={(e) => handleProjectImprovementChange(index, e.target.value)}
                          placeholder="Enter suggestions for improving this project..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                      </div>

                      {/* Project Link */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Link (GitHub, Live Demo, etc.)
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            value={projectLinks[index] || ''}
                            onChange={(e) => handleProjectLinkChange(index, e.target.value)}
                            placeholder="https://github.com/username/project or https://project-demo.com"
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                          <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-sm"
                >
                  Save Enhancements
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeEnhancer;