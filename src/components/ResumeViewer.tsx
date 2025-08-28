import React from 'react';
import { ArrowLeft, X, User, Mail, Phone, Linkedin, Github, GraduationCap, Briefcase, Code, Trophy, FileText } from 'lucide-react';

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

interface ResumeViewerProps {
  candidate: Candidate;
  onClose: () => void;
}

const ResumeViewer: React.FC<ResumeViewerProps> = ({ candidate, onClose }) => {
  // Get resume data - check for enhanced version first
  const getResumeData = () => {
    // Check if there's an enhanced resume saved
    const enhancedResumeData = localStorage.getItem(`enhanced_resume_${candidate.id}`);
    if (enhancedResumeData) {
      try {
        const parsedData = JSON.parse(enhancedResumeData);
        // Ensure we have all required fields
        return {
          ...parsedData,
          skills: parsedData.skills || [],
          projects: parsedData.projects || [],
          achievements: parsedData.achievements || [],
          experience: parsedData.experience || []
        };
      } catch (error) {
        console.error('Error loading enhanced resume:', error);
      }
    }
    
    // Fall back to original resume data
    const candidateResumes: { [key: string]: any } = {
      '1': { // Janhavi Sharma - missing Git
        name: "Janhavi Sharma",
        email: "janhavi.sharma@email.com",
        contact: "+91 9876543210",
        linkedin: "linkedin.com/in/janhavisharma",
        github: "", // Missing GitHub
        education: "Bachelor of Computer Science, Pune University (2021-2025)",
        summary: "Computer Science student with experience in web development and programming.",
        experience: [
          "Developed a Blood Bank Management System using Java and MySQL",
          "Created responsive web interfaces using HTML, CSS, and JavaScript"
        ],
        skills: ["Java", "React", "SQL"],
        projects: [
          "Blood Bank Management System - Java application with database integration",
          "E-commerce Website - Frontend development with responsive design"
        ],
        achievements: [
          "Dean's List for 2 consecutive semesters",
          "Winner of College Technical Fest 2023"
        ]
      },
      '2': { // Priya Patel - missing React, has GitHub
        name: "Aarya Ranpise",
        email: "aarya123r@email.com",
        contact: "+91 9856543211",
        linkedin: "linkedin.com/in/ranpiseaarya",
        github: "github.com/aarya",
        education: "Bachelor of Technology, MIT WPU (2021-2025)",
        summary: "Computer Science student with experience in web development and programming.",
        experience: [
          "Built web applications using Python and Django framework",
          "Created responsive web interfaces using HTML, CSS, and JavaScript"
        ],
        skills: ["Python", "Django", "HTML", "CSS"],
        projects: [
          "Library Management System - Python Django application",
          "Personal Portfolio Website - Frontend development with responsive design"
        ],
        achievements: [
          "Certiface of Merit in Academics for 2 years",
          "IBM - Java certification course"
        ]
      },
      '3': { // Priya Patel - missing React, has GitHub
        name: "Priya Patel",
        email: "priya.patel@email.com",
        contact: "+91 9876543211",
        linkedin: "linkedin.com/in/priyapatel",
        github: "github.com/priyapatel",
        education: "Bachelor of Information Technology, Mumbai University (2021-2025)",
        summary: "Computer Science student with experience in web development and programming.",
        experience: [
          "Built web applications using Python and Django framework",
          "Created responsive web interfaces using HTML, CSS, and JavaScript"
        ],
        skills: ["Python", "Django", "HTML", "CSS"],
        projects: [
          "Library Management System - Python Django application",
          "Personal Portfolio Website - Frontend development with responsive design"
        ],
        achievements: [
          "Certiface of Honour in Academics for 2 years",
          "IBM - Python certification course"
        ]
      },
      '4': { // Rahul Singh - missing SQL, no GitHub
        name: "Rahul Singh",
        email: "rahul.singh@email.com",
        contact: "+91 9876543212",
        linkedin: "linkedin.com/in/rahulsingh",
        github: "", // Missing GitHub
        education: "Bachelor of Computer Applications, Delhi University (2021-2025)",
        summary: "Computer Science student with experience in web development and programming.",
        experience: [
          "Developed REST APIs using Node.js and Express",
          "Created responsive web interfaces using HTML, CSS, and JavaScript"
        ],
        skills: ["JavaScript", "Node.js", "MongoDB"],
        projects: [
          "Chat Application - Real-time messaging using Node.js and Socket.io",
          "E-commerce Website - Full-stack development with responsive design"
        ],
        achievements: [
          "Best Project Award in Web Development course",
          "Merit at Academic Program - NIT Goa 2024"
        ]
      },
      '5': { // Anita Desai - missing backend, has GitHub
        name: "Anita Desai",
        email: "anita.desai@gmail.com",
        contact: "+91 9876543213",
        linkedin: "linkedin.com/in/anitadesai",
        github: "github.com/anitadesai",
        education: "Bachelor of Computer Science, Bangalore University (2021-2025)",
        summary: "Computer Science student with experience in web development and programming.",
        experience: [
          "Built interactive user interfaces using React and JavaScript",
          "Created responsive web designs using HTML, CSS, and modern frameworks"
        ],
        skills: ["React", "JavaScript", "CSS", "HTML"],
        projects: [
          "Weather App - React application with API integration",
          "Portfolio Website - Frontend development with modern design"
        ],
        achievements: [
          "Outstanding Student in Frontend Development",
          "Udemy - React certification course"
        ]
      },
      '6': { // Vikram Kumar - missing SQL, no GitHub
      name: "Vikram Kumar",
      email: "@vikram12345@gmail.com",
      contact: "+91 9876543212",
      linkedin: "linkedin.com/in/vikramks",
      github: "", // Missing GitHub
      education: "Bachelor of Computer Applications, Delhi University (2022-2026)",
      summary: "Computer Science student with experience in web development and software developement.",
      experience: [
        "Developed REST APIs using Node.js and Express",
        "Created responsive web interfaces using HTML, CSS, and JavaScript"
      ],
      skills: ["JavaScript", "Node.js", "MongoDB"],
      projects: [
        "Chat Application - Real-time messaging using Node.js and Socket.io",
        "E-commerce Website - Full-stack development with responsive design"
      ],
      achievements: [
        "Best Project Award in Web Development Hackwithme - 2024",
        "Coursera - JavaScript certification"
      ]
     },
    };

    return candidateResumes[candidate.id] || candidateResumes['1'];
  };

  const resumeData = getResumeData();
  
  // Check if this is an enhanced resume
  const isEnhancedResume = localStorage.getItem(`enhanced_resume_${candidate.id}`) !== null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEnhancedResume ? 'Enhanced Resume' : 'Resume'}
                </h1>
                <p className="text-gray-600">{resumeData.name}</p>
              </div>
            </div>
          </div>
          {isEnhancedResume && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Enhanced Version
            </div>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Resume Content */}
        <div className="p-8 bg-white">
          {/* Header Section */}
          <div className="text-center mb-8 pb-6 border-b border-gray-200">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 mx-auto mb-4">
              <img 
                src={candidate.profileImage} 
                alt={resumeData.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{resumeData.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{resumeData.summary}</p>
            
            {/* Contact Information */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{resumeData.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{resumeData.contact}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Linkedin className="w-4 h-4" />
                <span>{resumeData.linkedin}</span>
              </div>
              {resumeData.github && (
                <div className="flex items-center space-x-2">
                  <Github className="w-4 h-4" />
                  <span>{resumeData.github}</span>
                </div>
              )}
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Education</h2>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{resumeData.education}</p>
            </div>
          </div>

          {/* Experience Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Experience</h2>
            </div>
            <div className="space-y-3">
              {resumeData.experience.map((exp: string, index: number) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">• {exp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Code className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Technical Skills</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {resumeData.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className={`px-3 py-2 rounded-full text-sm font-medium ${
                    isEnhancedResume && index >= (candidate.skills?.length || 0)
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {skill}
                  {isEnhancedResume && index >= (candidate.skills?.length || 0) && (
                    <span className="ml-1 text-xs">✨</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Projects</h2>
            </div>
            <div className="space-y-3">
              {resumeData.projects.map((project: string, index: number) => (
                <div key={index} className={`p-4 rounded-lg ${
                  isEnhancedResume && project.includes('Full-stack') && project.includes('RESTful')
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50'
                }`}>
                  <p className="text-gray-700">• {project}</p>
                  {isEnhancedResume && project.includes('Full-stack') && project.includes('RESTful') && (
                    <span className="text-xs text-green-600 font-medium ml-2">Enhanced ✨</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Trophy className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
            </div>
            <div className="space-y-3">
              {resumeData.achievements.map((achievement: string, index: number) => (
                <div key={index} className={`p-4 rounded-lg ${
                  isEnhancedResume && achievement.includes('Oracle') && achievement.includes('Certified')
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50'
                }`}>
                  <p className="text-gray-700">• {achievement}</p>
                  {isEnhancedResume && achievement.includes('Oracle') && achievement.includes('Certified') && (
                    <span className="text-xs text-green-600 font-medium ml-2">New ✨</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Fitment Score */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEnhancedResume ? 'Enhanced' : 'Current'} Fitment Score
                </h3>
                <p className="text-sm text-gray-600">For Intern Software Developer position</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">
                  {(() => {
                    const saveKey = `resume_enhancements_${candidate.id}_default`;
                    const savedData = localStorage.getItem(saveKey);
                    if (savedData) {
                      try {
                        const { fitmentScore } = JSON.parse(savedData);
                        return `${fitmentScore}%`;
                      } catch (error) {
                        return `${candidate.fitmentScore}%`;
                      }
                    }
                    return `${candidate.fitmentScore}%`;
                  })()}
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(() => {
                        const saveKey = `resume_enhancements_${candidate.id}_default`;
                        const savedData = localStorage.getItem(saveKey);
                        if (savedData) {
                          try {
                            const { fitmentScore } = JSON.parse(savedData);
                            return fitmentScore;
                          } catch (error) {
                            return candidate.fitmentScore;
                          }
                        }
                        return candidate.fitmentScore;
                      })()}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;