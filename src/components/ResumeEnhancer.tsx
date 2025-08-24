import React, { useState, useEffect } from 'react';
import { X, Wand2, CheckCircle, RotateCcw, Plus, Link, FileText, Award, BookOpen, Heart } from 'lucide-react';

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

interface Enhancement {
  id: string;
  type: 'skill' | 'experience' | 'project' | 'achievement' | 'missing_section';
  title: string;
  description: string;
  originalText?: string;
  suggestedText: string;
  accepted: boolean;
  category?: string;
  projectLink?: string;
  hyperlink?: string;
}

interface MissingSection {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  content: string;
  hyperlink?: string;
  hasHyperlink: boolean;
}

interface ResumeEnhancerProps {
  candidate?: Candidate;
  onSave?: (candidateId: string, newScore: number, enhancedResume?: any) => void;
  onClose: () => void;
}

const ResumeEnhancer: React.FC<ResumeEnhancerProps> = ({ candidate, onSave, onClose }) => {
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [missingSections, setMissingSections] = useState<MissingSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFitmentScore, setCurrentFitmentScore] = useState(candidate?.fitmentScore || 65);

  // Get resume data for the candidate
  const getResumeData = () => {
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
        ],
        certifications: [],
        researchPapers: [],
        volunteering: []
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
        ],
        certifications: [],
        researchPapers: [],
        volunteering: []
      }
    };

    return candidateResumes[candidate?.id || '1'] || candidateResumes['1'];
  };

  const resumeData = getResumeData();

  // Initialize missing sections based on what's missing from the resume
  const initializeMissingSections = () => {
    const sections = [
      {
        id: 'certifications',
        name: 'Certifications',
        icon: Award,
        content: '',
        hyperlink: '',
        hasHyperlink: true
      },
      {
        id: 'achievements',
        name: 'Achievements',
        icon: CheckCircle,
        content: '',
        hyperlink: '',
        hasHyperlink: false
      },
      {
        id: 'researchPapers',
        name: 'Research Papers',
        icon: BookOpen,
        content: '',
        hyperlink: '',
        hasHyperlink: true
      },
      {
        id: 'volunteering',
        name: 'Volunteering',
        icon: Heart,
        content: '',
        hyperlink: '',
        hasHyperlink: false
      }
    ];

    const missing = sections.filter(section => {
      const sectionData = resumeData[section.id];
      return !sectionData || (Array.isArray(sectionData) && sectionData.length === 0);
    });

    setMissingSections(missing);
  };

  useEffect(() => {
    initializeMissingSections();
    generateEnhancements();
  }, [candidate]);

  const generateEnhancements = async () => {
    setIsGenerating(true);
    setProgress(0);

    // Simulate AI generation with progress
    const progressSteps = [
      { step: 20, message: "Analyzing resume content..." },
      { step: 40, message: "Identifying skill gaps..." },
      { step: 60, message: "Generating project improvements..." },
      { step: 80, message: "Creating enhancement suggestions..." },
      { step: 100, message: "Finalizing recommendations..." }
    ];

    for (const { step } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step);
    }

    // Generate personalized enhancements based on candidate
    const candidateEnhancements = getCandidateSpecificEnhancements();
    setEnhancements(candidateEnhancements);
    setIsGenerating(false);
  };

  const getCandidateSpecificEnhancements = (): Enhancement[] => {
    const candidateId = candidate?.id || '1';
    
    const enhancementsByCandidate: { [key: string]: Enhancement[] } = {
      '1': [ // Janhavi Sharma - missing Git
        {
          id: '1',
          type: 'skill',
          title: 'Add Git Version Control',
          description: 'Git is essential for software development collaboration',
          suggestedText: 'Git',
          accepted: false
        },
        {
          id: '2',
          type: 'experience',
          title: 'Enhance Experience Description',
          description: 'Add more technical details and impact metrics',
          originalText: 'Developed a Blood Bank Management System using Java and MySQL',
          suggestedText: 'Developed a comprehensive Blood Bank Management System using Java and MySQL, implementing CRUD operations and serving 500+ daily users with 99.9% uptime',
          accepted: false
        },
        {
          id: '3',
          type: 'project',
          title: 'Enhance Blood Bank Project',
          description: 'Add technical stack and impact details',
          originalText: 'Blood Bank Management System - Java application with database integration',
          suggestedText: 'Blood Bank Management System - Full-stack Java application with MySQL database, featuring user authentication, inventory management, and automated notifications. Reduced manual processing time by 60%',
          accepted: false,
          projectLink: ''
        },
        {
          id: '4',
          type: 'project',
          title: 'Enhance E-commerce Project',
          description: 'Add more technical details and frameworks used',
          originalText: 'E-commerce Website - Frontend development with responsive design',
          suggestedText: 'E-commerce Website - Responsive web application built with HTML5, CSS3, and JavaScript, featuring product catalog, shopping cart, and payment integration. Optimized for mobile devices with 95+ PageSpeed score',
          accepted: false,
          projectLink: ''
        }
      ],
      '2': [ // Aarya Ranpise - missing React
        {
          id: '1',
          type: 'skill',
          title: 'Add React Framework',
          description: 'React is crucial for modern frontend development',
          suggestedText: 'React',
          accepted: false
        },
        {
          id: '2',
          type: 'skill',
          title: 'Add JavaScript',
          description: 'JavaScript is fundamental for web development',
          suggestedText: 'JavaScript',
          accepted: false
        },
        {
          id: '3',
          type: 'experience',
          title: 'Enhance Django Experience',
          description: 'Add more specific details about Django features used',
          originalText: 'Built web applications using Python and Django framework',
          suggestedText: 'Built scalable web applications using Python and Django framework, implementing RESTful APIs, user authentication, and database optimization. Improved application performance by 40%',
          accepted: false
        },
        {
          id: '4',
          type: 'project',
          title: 'Enhance Library Management Project',
          description: 'Add technical details and user impact',
          originalText: 'Library Management System - Python Django application',
          suggestedText: 'Library Management System - Full-stack Django application with PostgreSQL database, featuring book catalog, user management, and automated fine calculation. Serves 1000+ library members efficiently',
          accepted: false,
          projectLink: ''
        }
      ]
    };

    return enhancementsByCandidate[candidateId] || enhancementsByCandidate['1'];
  };

  const toggleEnhancement = (id: string) => {
    setEnhancements(prev => prev.map(enhancement => {
      if (enhancement.id === id) {
        const newAccepted = !enhancement.accepted;
        
        // Update fitment score based on enhancement acceptance
        if (newAccepted) {
          setCurrentFitmentScore(prev => Math.min(prev + 3, 100));
        } else {
          setCurrentFitmentScore(prev => Math.max(prev - 3, 0));
        }
        
        return { ...enhancement, accepted: newAccepted };
      }
      return enhancement;
    }));
  };

  const updateEnhancementText = (id: string, newText: string) => {
    setEnhancements(prev => prev.map(enhancement => 
      enhancement.id === id ? { ...enhancement, suggestedText: newText } : enhancement
    ));
  };

  const updateProjectLink = (id: string, link: string) => {
    setEnhancements(prev => prev.map(enhancement => 
      enhancement.id === id ? { ...enhancement, projectLink: link } : enhancement
    ));
  };

  const updateMissingSectionContent = (id: string, content: string) => {
    setMissingSections(prev => prev.map(section =>
      section.id === id ? { ...section, content } : section
    ));
  };

  const updateMissingSectionHyperlink = (id: string, hyperlink: string) => {
    setMissingSections(prev => prev.map(section =>
      section.id === id ? { ...section, hyperlink } : section
    ));
  };

  const handleSave = () => {
    const acceptedEnhancements = enhancements.filter(e => e.accepted);
    const acceptedSkills = acceptedEnhancements
      .filter(e => e.type === 'skill')
      .map(e => e.suggestedText);
    
    const enhancedSkills = [...(candidate?.skills || []), ...acceptedSkills];
    
    // Create enhanced resume data
    const enhancedResume = {
      ...resumeData,
      skills: enhancedSkills,
      experience: resumeData.experience.map((exp: string) => {
        const enhancement = acceptedEnhancements.find(e => 
          e.type === 'experience' && e.originalText === exp
        );
        return enhancement ? enhancement.suggestedText : exp;
      }),
      projects: resumeData.projects.map((project: string) => {
        const enhancement = acceptedEnhancements.find(e => 
          e.type === 'project' && e.originalText === project
        );
        return enhancement ? enhancement.suggestedText : project;
      }),
      projectLinks: acceptedEnhancements
        .filter(e => e.type === 'project' && e.projectLink)
        .reduce((acc, e) => {
          acc[e.suggestedText] = e.projectLink;
          return acc;
        }, {} as { [key: string]: string }),
      // Add missing sections that have content
      ...missingSections.reduce((acc, section) => {
        if (section.content.trim()) {
          acc[section.id] = [{
            content: section.content,
            hyperlink: section.hyperlink || undefined
          }];
        }
        return acc;
      }, {} as { [key: string]: any })
    };

    if (onSave && candidate) {
      onSave(candidate.id, currentFitmentScore, enhancedResume);
    }
    
    onClose();
  };

  const acceptedCount = enhancements.filter(e => e.accepted).length;
  const totalEnhancements = enhancements.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Wand2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Enhancer</h1>
              <p className="text-gray-600">{candidate?.name || 'Candidate'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Section */}
        {isGenerating && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Generating AI Enhancements...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex">
          {/* Left Panel - Original Resume */}
          <div className="w-1/2 p-6 border-r border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Original Resume</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Experience</h3>
                <ul className="space-y-1 text-gray-600">
                  {resumeData.experience.map((exp: string, index: number) => (
                    <li key={index} className="text-xs">• {exp}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Projects</h3>
                <ul className="space-y-1 text-gray-600">
                  {resumeData.projects.map((project: string, index: number) => (
                    <li key={index} className="text-xs">• {project}</li>
                  ))}
                </ul>
              </div>

              {/* Show missing sections */}
              {missingSections.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-red-600 mb-2">Missing Sections</h3>
                  <ul className="space-y-1">
                    {missingSections.map((section) => (
                      <li key={section.id} className="text-xs text-red-500">
                        • {section.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Enhanced Resume */}
          <div className="w-1/2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Enhanced Resume</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{currentFitmentScore}%</div>
                <div className="text-xs text-gray-500">Fitment Score</div>
              </div>
            </div>

            {!isGenerating && (
              <div className="space-y-6">
                {/* Enhancements */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">
                    Suggested Improvements ({acceptedCount}/{totalEnhancements} accepted)
                  </h3>
                  <div className="space-y-4">
                    {enhancements.map((enhancement) => (
                      <div key={enhancement.id} className={`p-4 rounded-lg border-2 transition-all ${
                        enhancement.accepted 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-white'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">{enhancement.title}</h4>
                            <p className="text-xs text-gray-600 mt-1">{enhancement.description}</p>
                          </div>
                          <button
                            onClick={() => toggleEnhancement(enhancement.id)}
                            className={`ml-3 p-1 rounded transition-colors ${
                              enhancement.accepted
                                ? 'text-green-600 hover:text-green-700'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {enhancement.accepted ? <CheckCircle className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                          </button>
                        </div>
                        
                        <textarea
                          value={enhancement.suggestedText}
                          onChange={(e) => updateEnhancementText(enhancement.id, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded text-xs resize-none"
                          rows={3}
                        />

                        {/* Project Link Input for Project Enhancements */}
                        {enhancement.type === 'project' && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2 mb-1">
                              <Link className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">Project Link (GitHub/Live Demo)</span>
                            </div>
                            <input
                              type="url"
                              value={enhancement.projectLink || ''}
                              onChange={(e) => updateProjectLink(enhancement.id, e.target.value)}
                              placeholder="https://github.com/username/project or https://project-demo.com"
                              className="w-full p-2 border border-gray-300 rounded text-xs"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Sections */}
                {missingSections.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Add Missing Sections</h3>
                    <div className="space-y-4">
                      {missingSections.map((section) => {
                        const Icon = section.icon;
                        return (
                          <div key={section.id} className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                            <div className="flex items-center space-x-2 mb-3">
                              <Icon className="w-4 h-4 text-blue-600" />
                              <h4 className="font-medium text-gray-900 text-sm">{section.name}</h4>
                            </div>
                            
                            <textarea
                              value={section.content}
                              onChange={(e) => updateMissingSectionContent(section.id, e.target.value)}
                              placeholder={`Add ${section.name.toLowerCase()} details...`}
                              className="w-full p-2 border border-gray-300 rounded text-xs resize-none mb-2"
                              rows={3}
                            />

                            {/* Hyperlink input for Certifications and Research Papers */}
                            {section.hasHyperlink && (
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <Link className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-600">
                                    {section.id === 'certifications' ? 'Certificate Link' : 'Paper Link'}
                                  </span>
                                </div>
                                <input
                                  type="url"
                                  value={section.hyperlink}
                                  onChange={(e) => updateMissingSectionHyperlink(section.id, e.target.value)}
                                  placeholder={
                                    section.id === 'certifications' 
                                      ? "https://certificate-provider.com/verify/123" 
                                      : "https://journal.com/paper/123 or https://arxiv.org/abs/123"
                                  }
                                  className="w-full p-2 border border-gray-300 rounded text-xs"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

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
    </div>
  );
};

export default ResumeEnhancer;