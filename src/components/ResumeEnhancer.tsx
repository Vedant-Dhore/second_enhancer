import React, { useState, useEffect } from 'react';
import { X, Wand2, Sparkles, CheckCircle, XCircle, RotateCcw, User, Mail, Phone, Linkedin, Github, GraduationCap, Briefcase, Code, Trophy, FileText, Save } from 'lucide-react';

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
  const [currentFitmentScore, setCurrentFitmentScore] = useState(candidate?.fitmentScore || 85);
  const [enhancedSections, setEnhancedSections] = useState<{[key: string]: any}>({});
  const [sectionStates, setSectionStates] = useState<{[key: string]: 'accepted' | 'rejected' | 'editing' | 'original'}>({});
  const [editingContent, setEditingContent] = useState<{[key: string]: any}>({});
  const [projectHyperlinks, setProjectHyperlinks] = useState<{[key: string]: string}>({});
  const [sectionScoreImpacts, setSectionScoreImpacts] = useState<{[key: string]: number}>({});
  const [selectedSkills, setSelectedSkills] = useState<{[key: string]: boolean}>({});

  // Load saved enhancement state on component mount
  useEffect(() => {
    if (candidate) {
      // Load saved section states
      const savedStates = localStorage.getItem(`enhancement_states_${candidate.id}`);
      if (savedStates) {
        try {
          const states = JSON.parse(savedStates);
          setSectionStates(states.sectionStates || {});
          setEditingContent(states.editingContent || {});
          setSelectedSkills(states.selectedSkills || {});
          setProjectHyperlinks(states.projectHyperlinks || {});
          
          // Recalculate fitment score based on saved states
          let calculatedScore = candidate.fitmentScore;
          Object.entries(states.sectionStates || {}).forEach(([section, state]) => {
            if (state === 'accepted') {
              calculatedScore += sectionScoreImpacts[section] || 0;
            }
          });
          
          // Add skill selection impacts
          Object.entries(states.selectedSkills || {}).forEach(([skill, selected]) => {
            if (selected) calculatedScore += 1;
          });
          
          setCurrentFitmentScore(calculatedScore);
        } catch (error) {
          console.error('Error loading saved enhancement states:', error);
        }
      }
    }
  }, [candidate]);

  // Get resume data for the candidate
  const getResumeData = () => {
    // Check if there's an enhanced resume saved
    if (candidate) {
      const enhancedResumeData = localStorage.getItem(`enhanced_resume_${candidate.id}`);
      if (enhancedResumeData) {
        try {
          return JSON.parse(enhancedResumeData);
        } catch (error) {
          console.error('Error loading enhanced resume:', error);
        }
      }
    }
    
    // Fall back to original resume data
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
  const getEnhancementSuggestions = () => ({
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
  });

  // Initialize enhancements on component mount
  useEffect(() => {
    const suggestions = getEnhancementSuggestions();
    setEnhancedSections(suggestions);
    
    // Set initial score impacts for each section
    const impacts = {
      education: 2,
      summary: 3,
      experience: 4,
      projects: 3,
      skills: 2,
      achievements: 1
    };
    setSectionScoreImpacts(impacts);
  }, []);

  const handleSectionAction = (section: string, action: 'accept' | 'reject' | 'edit' | 'undo') => {
    const currentState = sectionStates[section] || 'original';
    const scoreImpact = sectionScoreImpacts[section] || 0;
    
    if (action === 'accept') {
      setSectionStates(prev => ({ ...prev, [section]: 'accepted' }));
      if (currentState !== 'accepted') {
        setCurrentFitmentScore(prev => Math.min(100, prev + scoreImpact));
      }
    } else if (action === 'reject') {
      setSectionStates(prev => ({ ...prev, [section]: 'rejected' }));
      if (currentState === 'accepted') {
        setCurrentFitmentScore(prev => Math.max(0, prev - scoreImpact));
      }
    } else if (action === 'edit') {
      setSectionStates(prev => ({ ...prev, [section]: 'editing' }));
      setEditingContent(prev => ({
        ...prev,
        [section]: enhancedSections[section]?.enhanced
      }));
    } else if (action === 'undo') {
      if (currentState === 'accepted') {
        setCurrentFitmentScore(prev => Math.max(0, prev - scoreImpact));
      }
      setSectionStates(prev => ({ ...prev, [section]: 'original' }));
      setEditingContent(prev => {
        const newContent = { ...prev };
        delete newContent[section];
        return newContent;
      });
    }
    
    // Save state changes immediately
    saveEnhancementState();
  };

  const handleSkillToggle = (skill: string) => {
    const isCurrentlySelected = selectedSkills[skill] || false;
    const newSelectedState = !isCurrentlySelected;
    
    setSelectedSkills(prev => ({
      ...prev,
      [skill]: newSelectedState
    }));
    
    // Update fitment score (+1% for select, -1% for deselect)
    if (newSelectedState) {
      setCurrentFitmentScore(prev => Math.min(100, prev + 1));
    } else {
      setCurrentFitmentScore(prev => Math.max(0, prev - 1));
    }
    
    // Save state changes immediately
    setTimeout(saveEnhancementState, 100);
  };

  const handleSaveEdit = (section: string) => {
    const editedContent = editingContent[section];
    setEnhancedSections(prev => ({
      ...prev,
      [section]: { ...prev[section], enhanced: editedContent }
    }));
    setSectionStates(prev => ({ ...prev, [section]: 'accepted' }));
    const scoreImpact = sectionScoreImpacts[section] || 0;
    setCurrentFitmentScore(prev => Math.min(100, prev + scoreImpact));
    setEditingContent(prev => {
      const newContent = { ...prev };
      delete newContent[section];
      return newContent;
    });
    
    // Save state changes immediately
    saveEnhancementState();
  };

  const handleSectionEdit = (section: string, newContent: any) => {
    setEditingContent(prev => ({ ...prev, [section]: newContent }));
  };

  const handleProjectHyperlinkChange = (projectIndex: number, hyperlink: string) => {
    setProjectHyperlinks(prev => ({
      ...prev,
      [`project_${projectIndex}`]: hyperlink
    }));
    
    // Save state changes immediately
    setTimeout(saveEnhancementState, 100);
  };

  // Save enhancement state to localStorage
  const saveEnhancementState = () => {
    if (!candidate) return;
    
    const stateToSave = {
      sectionStates,
      editingContent,
      selectedSkills,
      projectHyperlinks,
      currentFitmentScore,
      timestamp: Date.now()
    };
    
    localStorage.setItem(`enhancement_states_${candidate.id}`, JSON.stringify(stateToSave));
  };

  const handleSaveEnhancements = () => {
    if (candidate && onSave) {
      // Build enhanced resume with all accepted/edited changes
      const baseResume = getOriginalResumeData();
      const enhancedResume = { ...baseResume };
      
      // Apply section enhancements
      Object.entries(sectionStates).forEach(([section, state]) => {
        if (state === 'accepted') {
          if (section === 'education') {
            enhancedResume.education = enhancedSections.education?.enhanced || baseResume.education;
          } else if (section === 'summary') {
            enhancedResume.summary = enhancedSections.summary?.enhanced || baseResume.summary;
          } else if (section === 'experience') {
            enhancedResume.experience = enhancedSections.experience?.enhanced || baseResume.experience;
          } else if (section === 'projects') {
            enhancedResume.projects = enhancedSections.projects?.enhanced || baseResume.projects;
          } else if (section === 'achievements') {
            enhancedResume.achievements = enhancedSections.achievements?.enhanced || baseResume.achievements;
          }
        }
      });
      
      // Apply skill enhancements
      const enhancedSkills = [...baseResume.skills];
      if (enhancedSections.skills) {
        enhancedSections.skills.enhanced
          .filter((skill: string) => !baseResume.skills.includes(skill) && selectedSkills[skill])
          .forEach((skill: string) => {
            if (!enhancedSkills.includes(skill)) {
              enhancedSkills.push(skill);
            }
          });
      }
      enhancedResume.skills = enhancedSkills;
      
      // Add project hyperlinks
      enhancedResume.projectHyperlinks = projectHyperlinks;
      
      // Save the complete enhanced resume
      localStorage.setItem(`enhanced_resume_${candidate.id}`, JSON.stringify(enhancedResume));
      
      // Save the current enhancement states
      saveEnhancementState();
      
      // Update candidate fitment score and skills in context
      if (enhancedSkills.length > baseResume.skills.length) {
        onSave(candidate.id, currentFitmentScore, enhancedSkills);
      } else {
        onSave(candidate.id, currentFitmentScore);
      }
    }
    onClose();
  };
  
  // Get original resume data (not enhanced)
  const getOriginalResumeData = () => {
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

    return candidateResumes[candidate?.id || '1'] || candidateResumes['1'];
  };

  // Function to get current fitment score (including any in-progress enhancements)
  const getCurrentFitmentScore = () => {
    const savedStates = localStorage.getItem(`enhancement_states_${candidate?.id}`);
    if (savedStates) {
      try {
        const { currentFitmentScore: savedScore } = JSON.parse(savedStates);
        return savedScore || currentFitmentScore;
      } catch (error) {
        return currentFitmentScore;
      }
    }
    return currentFitmentScore;
  };

  // Update the displayed resume data to use enhanced version if available
  const getDisplayResumeData = () => {
    if (candidate) {
      const enhancedResumeData = localStorage.getItem(`enhanced_resume_${candidate.id}`);
      if (enhancedResumeData) {
        try {
          const enhanced = JSON.parse(enhancedResumeData);
          // Merge with original data to ensure all fields are present
          const original = getOriginalResumeData();
          return { ...original, ...enhanced };
        } catch (error) {
          console.error('Error loading enhanced resume:', error);
        }
      }
    }
    return getOriginalResumeData();
  };

  const resumeData = getDisplayResumeData();
      };
      
      onSave(candidate.id, currentFitmentScore, enhancedResume);
    }
    onClose();
  };

  const ActionButtons: React.FC<{ section: string }> = ({ section }) => {
    const currentState = sectionStates[section] || 'original';
    const isEditing = currentState === 'editing';
    
    if (isEditing) {
      return (
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => handleSaveEdit(section)}
            className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
          >
            <Save className="w-3 h-3" />
            <span>Save Edit</span>
          </button>
          <button
            onClick={() => handleSectionAction(section, 'undo')}
            className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Cancel</span>
          </button>
        </div>
      );
    }
    
    return (
    <div className="flex space-x-2 mt-2">
      {currentState !== 'accepted' && (
      <button
        onClick={() => handleSectionAction(section, 'accept')}
        className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
      >
        <CheckCircle className="w-3 h-3" />
        <span>Accept</span>
      </button>
      )}
      {currentState !== 'rejected' && (
      <button
        onClick={() => handleSectionAction(section, 'reject')}
        className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
      >
        <XCircle className="w-3 h-3" />
        <span>Reject</span>
      </button>
      )}
      {currentState !== 'editing' && (
      <button
        onClick={() => handleSectionAction(section, 'edit')}
        className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors"
      >
        <span>Edit</span>
      </button>
      )}
      {currentState !== 'original' && (
      <button
        onClick={() => handleSectionAction(section, 'undo')}
        className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Undo</span>
      </button>
      )}
    </div>
    );
  };

  const getStatusBadge = (section: string) => {
    const currentState = sectionStates[section] || 'original';
    
    switch (currentState) {
      case 'accepted':
        return <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded ml-2">✓ Accepted</span>;
      case 'rejected':
        return <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded ml-2">✗ Rejected</span>;
      case 'editing':
        return <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded ml-2">✎ Editing</span>;
      default:
        return null;
    }
  };

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
              {/* Progress Bar */}
              <div className="w-24 bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${currentFitmentScore}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="px-6 pb-4 border-b border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={handleSaveEnhancements}
              className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-sm"
            >
              Save Enhanced Resume
            </button>
          </div>
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
                  {getStatusBadge('education')}
                </div>
                {enhancedSections.education && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Suggested Addition</span>
                    </div>
                    {sectionStates.education === 'editing' ? (
                    <textarea
                        value={editingContent.education || ''}
                      onChange={(e) => handleSectionEdit('education', e.target.value)}
                      className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                      rows={3}
                    />
                    ) : (
                      <div className={`text-sm text-gray-700 ${sectionStates.education === 'rejected' ? 'line-through opacity-60' : ''}`}>
                        {enhancedSections.education.enhanced}
                      </div>
                    )}
                    <ActionButtons section="education" />
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Summary</h3>
                  {getStatusBadge('summary')}
                </div>
                {enhancedSections.summary && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {sectionStates.summary === 'editing' ? (
                    <textarea
                        value={editingContent.summary || ''}
                      onChange={(e) => handleSectionEdit('summary', e.target.value)}
                      className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                      rows={4}
                    />
                    ) : (
                      <div className={`text-sm text-gray-700 ${sectionStates.summary === 'rejected' ? 'line-through opacity-60' : ''}`}>
                        {enhancedSections.summary.enhanced}
                      </div>
                    )}
                    <ActionButtons section="summary" />
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Experience</h3>
                  {getStatusBadge('experience')}
                </div>
                {enhancedSections.experience && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Suggested Improvement</span>
                    </div>
                    {sectionStates.experience === 'editing' ? (
                    <div className="space-y-2">
                        {(editingContent.experience || enhancedSections.experience.enhanced).map((exp: string, index: number) => (
                        <textarea
                          key={index}
                          value={exp}
                          onChange={(e) => {
                              const newExperience = [...(editingContent.experience || enhancedSections.experience.enhanced)];
                            newExperience[index] = e.target.value;
                            handleSectionEdit('experience', newExperience);
                          }}
                          className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                          rows={2}
                        />
                      ))}
                    </div>
                    ) : (
                      <div className={`space-y-2 ${sectionStates.experience === 'rejected' ? 'line-through opacity-60' : ''}`}>
                        {enhancedSections.experience.enhanced.map((exp: string, index: number) => (
                          <div key={index} className="text-sm text-gray-700">
                            {exp}
                          </div>
                        ))}
                      </div>
                    )}
                    <ActionButtons section="experience" />
                  </div>
                )}
              </div>

              {/* Projects */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Projects</h3>
                  {getStatusBadge('projects')}
                </div>
                {enhancedSections.projects && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {sectionStates.projects === 'editing' ? (
                    <div className="space-y-4">
                        {(editingContent.projects || enhancedSections.projects.enhanced).map((project: string, index: number) => (
                        <div key={index} className="space-y-2">
                          <textarea
                            value={project}
                            onChange={(e) => {
                                const newProjects = [...(editingContent.projects || enhancedSections.projects.enhanced)];
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
                    ) : (
                      <div className={`space-y-4 ${sectionStates.projects === 'rejected' ? 'line-through opacity-60' : ''}`}>
                        {enhancedSections.projects.enhanced.map((project: string, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="text-sm text-gray-700">{project}</div>
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
                    )}
                    <ActionButtons section="projects" />
                  </div>
                )}
              </div>

              {/* Skills */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Code className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Skills</h3>
                </div>
                
                {/* Current Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                        {skill}
                      </span>
                    ))}
                    {/* Show selected additional skills */}
                    {enhancedSections.skills && enhancedSections.skills.enhanced
                      .filter((skill: string) => !resumeData.skills.includes(skill) && selectedSkills[skill])
                      .map((skill: string, index: number) => (
                        <span key={`new-${index}`} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                          {skill} ✓
                        </span>
                      ))}
                  </div>
                </div>
                
                {/* Suggested Additional Skills */}
                {enhancedSections.skills && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        Suggested Additional Skills
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {enhancedSections.skills.enhanced
                        .filter((skill: string) => !resumeData.skills.includes(skill))
                        .map((skill: string, index: number) => (
                        <label key={index} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedSkills[skill] || false}
                            onChange={() => handleSkillToggle(skill)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className={`px-2 py-1 rounded text-sm transition-colors ${
                            selectedSkills[skill] 
                              ? 'bg-green-100 text-green-800 font-medium' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {skill}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Achievements</h3>
                  {getStatusBadge('achievements')}
                </div>
                {enhancedSections.achievements && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {sectionStates.achievements === 'editing' ? (
                    <div className="space-y-2">
                        {(editingContent.achievements || enhancedSections.achievements.enhanced).map((achievement: string, index: number) => (
                        <textarea
                          key={index}
                          value={achievement}
                          onChange={(e) => {
                              const newAchievements = [...(editingContent.achievements || enhancedSections.achievements.enhanced)];
                            newAchievements[index] = e.target.value;
                            handleSectionEdit('achievements', newAchievements);
                          }}
                          className="w-full text-sm text-gray-700 bg-transparent border-none resize-none focus:outline-none"
                          rows={1}
                        />
                      ))}
                    </div>
                    ) : (
                      <div className={`space-y-2 ${sectionStates.achievements === 'rejected' ? 'line-through opacity-60' : ''}`}>
                        {enhancedSections.achievements.enhanced.map((achievement: string, index: number) => (
                          <div key={index} className="text-sm text-gray-700">
                            {achievement}
                          </div>
                        ))}
                      </div>
                    )}
                    <ActionButtons section="achievements" />
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