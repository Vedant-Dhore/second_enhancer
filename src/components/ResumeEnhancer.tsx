import React, { useState, useEffect } from 'react';
import { X, Wand2, Sparkles, CheckCircle, XCircle, RotateCcw, User, Mail, Phone, Linkedin, Github, GraduationCap, Briefcase, Code, Trophy, FileText } from 'lucide-react';

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
  const [currentFitmentScore, setCurrentFitmentScore] = useState(85);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementProgress, setEnhancementProgress] = useState(0);
  const [enhancedSections, setEnhancedSections] = useState<{[key: string]: any}>({});
  const [sectionStates, setSectionStates] = useState<{[key: string]: 'original' | 'enhanced'}>({});
  const [projectHyperlinks, setProjectHyperlinks] = useState<{[key: string]: string}>({});

  // Get resume data for the candidate
  const getResumeData = () => {
    if (!candidate) {
      return {
        name: "Sample Candidate",
        email: "sample@email.com",
        contact: "+91 9876543210",
        linkedin: "linkedin.com/in/sample",
        github: "github.com/sample",
        education: "Bachelor of Computer Science, Sample University (2021-2025)",
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
      };
    }

    const candidateResumes: { [key: string]: any } = {
      '1': {
        name: "Janhavi Sharma",
        email: "janhavi.sharma@email.com",
        contact: "+91 9876543210",
        linkedin: "linkedin.com/in/janhavisharma",
        github: "",
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
      '2': {
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
          "Certificate of Merit in Academics for 2 years",
          "IBM - Java certification course"
        ]
      }
    };

    return candidateResumes[candidate.id] || candidateResumes['1'];
  };

  const resumeData = getResumeData();

  // Enhanced suggestions for each section
  const enhancementSuggestions = {
    education: {
      original: resumeData.education,
      enhanced: "Bachelor of Computer Science, Pune University (2021-2025)\nRelevant Coursework: Data Structures, Algorithms, Database Management, Software Engineering\nGPA: 8.5/10"
    },
    summary: {
      original: resumeData.summary,
      enhanced: "Passionate Computer Science student with hands-on experience in full-stack web development and programming. Proficient in Java backend development, React frontend frameworks, and SQL database management. Demonstrated ability to build scalable applications with strong problem-solving skills and attention to detail."
    },
    experience: {
      original: resumeData.experience,
      enhanced: [
        "• Developed a Blood Bank Management System using Java and MySQL, implementing secure authentication, inventory tracking, and donor management features with responsive UI design",
        "• Created responsive web interfaces using HTML, CSS, and JavaScript, optimizing user experience across multiple devices and browsers with modern design principles"
      ]
    },
    projects: {
      original: resumeData.projects,
      enhanced: [
        "• Blood Bank Management System - Java application with database integration using MySQL, featuring donor registration, blood inventory tracking, and admin dashboard with secure authentication",
        "• E-commerce Website - Frontend development with responsive design using React.js, implementing shopping cart functionality, product catalog, and payment gateway integration"
      ]
    },
    skills: {
      original: resumeData.skills,
      enhanced: ["Java", "React", "SQL", "JavaScript", "HTML/CSS", "Git"]
    },
    achievements: {
      original: resumeData.achievements,
      enhanced: [
        "• Dean's List for 2 consecutive semesters (2022-2023)",
        "• Winner of College Technical Fest 2023 - Best Project Award",
        "• Completed Oracle Java SE 11 Developer Certification"
      ]
    }
  };

  const handleStartEnhancement = () => {
    setIsEnhancing(true);
    setEnhancementProgress(0);
    
    // Simulate AI enhancement process
    const interval = setInterval(() => {
      setEnhancementProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsEnhancing(false);
          // Set all sections to enhanced by default
          const newSectionStates: {[key: string]: 'original' | 'enhanced'} = {};
          Object.keys(enhancementSuggestions).forEach(section => {
            newSectionStates[section] = 'enhanced';
          });
          setSectionStates(newSectionStates);
          setEnhancedSections(enhancementSuggestions);
          setCurrentFitmentScore(92);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const handleSectionAction = (section: string, action: 'accept' | 'reject' | 'edit' | 'undo') => {
    if (action === 'accept') {
      setSectionStates(prev => ({ ...prev, [section]: 'enhanced' }));
    } else if (action === 'reject' || action === 'undo') {
      setSectionStates(prev => ({ ...prev, [section]: 'original' }));
    }
  };

  const handleSectionEdit = (section: string, newContent: any) => {
    setEnhancedSections(prev => ({
      ...prev,
      [section]: { ...prev[section], enhanced: newContent }
    }));
  };

  const handleProjectHyperlinkChange = (projectIndex: number, hyperlink: string) => {
    setProjectHyperlinks(prev => ({
      ...prev,
      [`project_${projectIndex}`]: hyperlink
    }));
  };

  const handleSaveEnhancements = () => {
    if (candidate && onSave) {
      const enhancedResume = {
        ...resumeData,
        education: sectionStates.education === 'enhanced' ? enhancedSections.education?.enhanced : resumeData.education,
        summary: sectionStates.summary === 'enhanced' ? enhancedSections.summary?.enhanced : resumeData.summary,
        experience: sectionStates.experience === 'enhanced' ? enhancedSections.experience?.enhanced : resumeData.experience,
        projects: sectionStates.projects === 'enhanced' ? enhancedSections.projects?.enhanced : resumeData.projects,
        skills: sectionStates.skills === 'enhanced' ? enhancedSections.skills?.enhanced : resumeData.skills,
        achievements: sectionStates.achievements === 'enhanced' ? enhancedSections.achievements?.enhanced : resumeData.achievements,
        projectHyperlinks: projectHyperlinks
      };
      
      onSave(candidate.id, currentFitmentScore, enhancedResume);
    }
    onClose();
  };

  const ActionButtons: React.FC<{ section: string }> = ({ section }) => (
    <div className="flex space-x-2 mt-2">
      <button
        onClick={() => handleSectionAction(section, 'accept')}
        className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
      >
        <CheckCircle className="w-3 h-3" />
        <span>Accept</span>
      </button>
      <button
        onClick={() => handleSectionAction(section, 'reject')}
        className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
      >
        <XCircle className="w-3 h-3" />
        <span>Reject</span>
      </button>
      <button
        onClick={() => handleSectionAction(section, 'edit')}
        className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
      >
        <span>Edit</span>
      </button>
      <button
        onClick={() => handleSectionAction(section, 'undo')}
        className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Undo</span>
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Wand2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Enhancer</h1>
              <p className="text-gray-600">AI-powered resume optimization for better job fitment</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600">Current Fitment</div>
              <div className="text-2xl font-bold text-purple-600">{currentFitmentScore}%</div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* AI Enhancement Status */}
        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">AI Enhancement Ready</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleStartEnhancement}
                disabled={isEnhancing}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>{isEnhancing ? 'Enhancing...' : 'Start AI Enhancement'}</span>
              </button>
              <button
                onClick={handleSaveEnhancements}
                className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-sm"
              >
                Save Enhanced Resume
              </button>
            </div>
          </div>
          
          {isEnhancing && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${enhancementProgress}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Resume Comparison */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Original Resume */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <FileText className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Original Resume</h2>
              </div>

              {/* Contact Info */}
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{resumeData.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{resumeData.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{resumeData.contact}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Linkedin className="w-4 h-4" />
                    <span>{resumeData.linkedin}</span>
                  </div>
                  {resumeData.github && (
                    <div className="flex items-center justify-center space-x-2">
                      <Github className="w-4 h-4" />
                      <span>{resumeData.github}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Education</h3>
                </div>
                <p className="text-gray-700 text-sm">{resumeData.education}</p>
              </div>

              {/* Summary */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Summary</h3>
                </div>
                <p className="text-gray-700 text-sm">{resumeData.summary}</p>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Experience</h3>
                </div>
                <div className="space-y-2">
                  {resumeData.experience.map((exp: string, index: number) => (
                    <p key={index} className="text-gray-700 text-sm">• {exp}</p>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Projects</h3>
                </div>
                <div className="space-y-2">
                  {resumeData.projects.map((project: string, index: number) => (
                    <p key={index} className="text-gray-700 text-sm">• {project}</p>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Achievements</h3>
                </div>
                <div className="space-y-2">
                  {resumeData.achievements.map((achievement: string, index: number) => (
                    <p key={index} className="text-gray-700 text-sm">• {achievement}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Resume */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Enhanced Resume</h2>
              </div>

              {/* Contact Info */}
              <div className="mb-6 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{resumeData.name}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{resumeData.email}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{resumeData.contact}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Linkedin className="w-4 h-4" />
                    <span>{resumeData.linkedin}</span>
                  </div>
                  {resumeData.github && (
                    <div className="flex items-center justify-center space-x-2">
                      <Github className="w-4 h-4" />
                      <span>{resumeData.github}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Education</h3>
                </div>
                {enhancedSections.education ? (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Suggested Addition</span>
                    </div>
                    <textarea
                      value={sectionStates.education === 'enhanced' ? enhancedSections.education.enhanced : enhancedSections.education.original}
                      onChange={(e) => handleSectionEdit('education', e.target.value)}
                      className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                      rows={3}
                    />
                    <ActionButtons section="education" />
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm">{resumeData.education}</p>
                )}
              </div>

              {/* Summary */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Summary</h3>
                </div>
                {enhancedSections.summary ? (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <textarea
                      value={sectionStates.summary === 'enhanced' ? enhancedSections.summary.enhanced : enhancedSections.summary.original}
                      onChange={(e) => handleSectionEdit('summary', e.target.value)}
                      className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                      rows={4}
                    />
                    <ActionButtons section="summary" />
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm">{resumeData.summary}</p>
                )}
              </div>

              {/* Experience */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Experience</h3>
                </div>
                {enhancedSections.experience ? (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Suggested Improvement</span>
                    </div>
                    <div className="space-y-2">
                      {(sectionStates.experience === 'enhanced' ? enhancedSections.experience.enhanced : enhancedSections.experience.original).map((exp: string, index: number) => (
                        <textarea
                          key={index}
                          value={exp}
                          onChange={(e) => {
                            const newExperience = [...(sectionStates.experience === 'enhanced' ? enhancedSections.experience.enhanced : enhancedSections.experience.original)];
                            newExperience[index] = e.target.value;
                            handleSectionEdit('experience', newExperience);
                          }}
                          className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                          rows={2}
                        />
                      ))}
                    </div>
                    <ActionButtons section="experience" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resumeData.experience.map((exp: string, index: number) => (
                      <p key={index} className="text-gray-700 text-sm">• {exp}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Projects</h3>
                </div>
                {enhancedSections.projects ? (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="space-y-4">
                      {(sectionStates.projects === 'enhanced' ? enhancedSections.projects.enhanced : enhancedSections.projects.original).map((project: string, index: number) => (
                        <div key={index} className="space-y-2">
                          <textarea
                            value={project}
                            onChange={(e) => {
                              const newProjects = [...(sectionStates.projects === 'enhanced' ? enhancedSections.projects.enhanced : enhancedSections.projects.original)];
                              newProjects[index] = e.target.value;
                              handleSectionEdit('projects', newProjects);
                            }}
                            className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                            rows={2}
                          />
                          <input
                            type="url"
                            placeholder="Enter project hyperlink (e.g., GitHub or Live Demo)"
                            value={projectHyperlinks[`project_${index}`] || ''}
                            onChange={(e) => handleProjectHyperlinkChange(index, e.target.value)}
                            className="w-full text-sm text-gray-600 bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      ))}
                    </div>
                    <ActionButtons section="projects" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resumeData.projects.map((project: string, index: number) => (
                      <p key={index} className="text-gray-700 text-sm">• {project}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Skills</h3>
                </div>
                {enhancedSections.skills ? (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Suggested Skills to Add</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(sectionStates.skills === 'enhanced' ? enhancedSections.skills.enhanced : enhancedSections.skills.original).map((skill: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <ActionButtons section="skills" />
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Achievements</h3>
                </div>
                {enhancedSections.achievements ? (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="space-y-2">
                      {(sectionStates.achievements === 'enhanced' ? enhancedSections.achievements.enhanced : enhancedSections.achievements.original).map((achievement: string, index: number) => (
                        <textarea
                          key={index}
                          value={achievement}
                          onChange={(e) => {
                            const newAchievements = [...(sectionStates.achievements === 'enhanced' ? enhancedSections.achievements.enhanced : enhancedSections.achievements.original)];
                            newAchievements[index] = e.target.value;
                            handleSectionEdit('achievements', newAchievements);
                          }}
                          className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                          rows={1}
                        />
                      ))}
                    </div>
                    <ActionButtons section="achievements" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {resumeData.achievements.map((achievement: string, index: number) => (
                      <p key={index} className="text-gray-700 text-sm">• {achievement}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEnhancer;