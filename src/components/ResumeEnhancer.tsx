import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Wand2, Download, RefreshCw } from 'lucide-react';

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

interface SavedEnhancement {
  id: string;
  type: 'skill' | 'project' | 'certification' | 'experience' | 'education';
  category: string;
  originalValue?: string;
  enhancedValue: string;
  accepted: boolean;
  edited: boolean;
  userEditedValue?: string;
  timestamp: number;
}

interface SavedEnhancementData {
  candidateId: string;
  jobId: string;
  enhancements: SavedEnhancement[];
  fitmentScore: number;
  originalFitmentScore: number;
  lastUpdated: number;
  advancedAnswers: {[key: string]: string};
}

interface ResumeEnhancerProps {
  candidate?: Candidate;
  onSave?: (candidateId: string, newScore: number, enhancedResume?: any) => void;
  onClose: () => void;
  jobId?: string;
}

const ResumeEnhancer: React.FC<ResumeEnhancerProps> = ({ 
  candidate, 
  onSave, 
  onClose,
  jobId
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'advanced'>('quick');
  const [savedEnhancements, setSavedEnhancements] = useState<SavedEnhancement[]>([]);
  const [enhancementStates, setEnhancementStates] = useState<{[key: string]: {accepted: boolean, edited: boolean, userValue?: string}}>({});
  const [isResumeEnhanced, setIsResumeEnhanced] = useState(false);
  const [advancedAnswers, setAdvancedAnswers] = useState<{[key: string]: string}>({});
  const [currentFitmentScore, setCurrentFitmentScore] = useState(candidate?.fitmentScore || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasExistingEnhancements, setHasExistingEnhancements] = useState(false);

  // Load saved enhancements on component mount
  useEffect(() => {
    if (candidate?.id) {
      loadSavedEnhancements();
    }
  }, [candidate?.id, jobId]);

  const getSaveKey = () => {
    return `resume_enhancements_${candidate?.id}_${jobId || 'default'}`;
  };

  const loadSavedEnhancements = () => {
    setIsLoading(true);
    try {
      const saveKey = getSaveKey();
      const savedData = localStorage.getItem(saveKey);
      
      if (savedData) {
        const parsedData: SavedEnhancementData = JSON.parse(savedData);
        setSavedEnhancements(parsedData.enhancements || []);
        setCurrentFitmentScore(parsedData.fitmentScore || candidate?.fitmentScore || 0);
        setAdvancedAnswers(parsedData.advancedAnswers || {});
        setHasExistingEnhancements(true);
        setIsResumeEnhanced(true);
        
        // Rebuild enhancement states from saved data
        const states: {[key: string]: {accepted: boolean, edited: boolean, userValue?: string}} = {};
        parsedData.enhancements.forEach(enhancement => {
          states[enhancement.id] = {
            accepted: enhancement.accepted,
            edited: enhancement.edited,
            userValue: enhancement.userEditedValue
          };
        });
        setEnhancementStates(states);
      } else {
        // No saved data, generate fresh enhancements
        const freshEnhancements = generateEnhancements();
        setSavedEnhancements(freshEnhancements);
        setHasExistingEnhancements(false);
        setCurrentFitmentScore(candidate?.fitmentScore || 0);
      }
    } catch (error) {
      console.error('Error loading saved enhancements:', error);
      // Fallback to fresh enhancements
      const freshEnhancements = generateEnhancements();
      setSavedEnhancements(freshEnhancements);
      setHasExistingEnhancements(false);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEnhancementsToStorage = (enhancements: SavedEnhancement[], fitmentScore: number, answers: {[key: string]: string} = {}) => {
    try {
      const saveKey = getSaveKey();
      const dataToSave: SavedEnhancementData = {
        candidateId: candidate?.id || '',
        jobId: jobId || 'default',
        enhancements,
        fitmentScore,
        originalFitmentScore: candidate?.fitmentScore || 0,
        lastUpdated: Date.now(),
        advancedAnswers: answers
      };
      
      localStorage.setItem(saveKey, JSON.stringify(dataToSave));
      
      // Also save enhanced resume data for ResumeViewer
      const enhancedResumeData = createEnhancedResumeData(enhancements);
      localStorage.setItem(`enhanced_resume_${candidate?.id}`, JSON.stringify(enhancedResumeData));
      
      return true;
    } catch (error) {
      console.error('Error saving enhancements:', error);
      return false;
    }
  };

  const createEnhancedResumeData = (enhancements: SavedEnhancement[]) => {
    const resumeData = getResumeData();
    const enhancedResume = { ...resumeData };
    
    // Apply accepted enhancements to create enhanced resume
    const acceptedEnhancements = enhancements.filter(e => e.accepted);
    
    // Enhance skills
    const skillEnhancements = acceptedEnhancements.filter(e => e.type === 'skill');
    if (skillEnhancements.length > 0) {
      const newSkills = skillEnhancements.map(e => e.userEditedValue || e.enhancedValue);
      enhancedResume.skills = [...(resumeData.skills || []), ...newSkills];
    }
    
    // Enhance projects
    const projectEnhancements = acceptedEnhancements.filter(e => e.type === 'project');
    if (projectEnhancements.length > 0) {
      const newProjects = projectEnhancements.map(e => e.userEditedValue || e.enhancedValue);
      enhancedResume.projects = [...(resumeData.projects || []), ...newProjects];
    }
    
    // Enhance certifications
    const certificationEnhancements = acceptedEnhancements.filter(e => e.type === 'certification');
    if (certificationEnhancements.length > 0) {
      const newCertifications = certificationEnhancements.map(e => e.userEditedValue || e.enhancedValue);
      enhancedResume.achievements = [...(resumeData.achievements || []), ...newCertifications];
    }
    
    return enhancedResume;
  };

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
      },
      '3': {
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
          "Certificate of Honour in Academics for 2 years",
          "IBM - Python certification course"
        ]
      },
      '4': {
        name: "Rahul Singh",
        email: "rahul.singh@email.com",
        contact: "+91 9876543212",
        linkedin: "linkedin.com/in/rahulsingh",
        github: "",
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
      '5': {
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
      '6': {
        name: "Vikram Kumar",
        email: "@vikram12345@gmail.com",
        contact: "+91 9876543212",
        linkedin: "linkedin.com/in/vikramks",
        github: "",
        education: "Bachelor of Computer Applications, Delhi University (2022-2026)",
        summary: "Computer Science student with experience in web development and software development.",
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
      }
    };

    return candidateResumes[candidate?.id || '1'] || candidateResumes['1'];
  };

  const getJobRequirements = () => {
    return {
      skills: ['Java', 'React', 'SQL', 'Git'],
      experience: '0-2 years',
      description: 'Seeking a passionate Junior Software Developer for Java backend development, React front-end, and SQL database management for AI Agentic applications.',
      responsibilities: [
        'Develop and maintain web applications',
        'Work with databases and APIs',
        'Collaborate with development team',
        'Write clean, maintainable code'
      ]
    };
  };

  const generateEnhancements = (): SavedEnhancement[] => {
    const resumeData = getResumeData();
    const jobReqs = getJobRequirements();
    const enhancements: SavedEnhancement[] = [];

    // Check for missing skills
    const missingSkills = jobReqs.skills.filter(skill => 
      !resumeData.skills.some((resumeSkill: string) => 
        resumeSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );

    missingSkills.forEach((skill, index) => {
      enhancements.push({
        id: `skill_${skill.toLowerCase()}_${Date.now()}_${index}`,
        type: 'skill',
        category: 'Skills Enhancement',
        enhancedValue: skill,
        accepted: false,
        edited: false,
        timestamp: Date.now()
      });
    });

    // Project enhancements
    if (resumeData.projects && resumeData.projects.length > 0) {
      enhancements.push({
        id: `project_enhancement_${Date.now()}`,
        type: 'project',
        category: 'Project Enhancement',
        originalValue: resumeData.projects[0],
        enhancedValue: 'Blood Bank Management System - Full-stack Java application with MySQL database, featuring donor registration, blood inventory management, and automated notifications. Implemented MVC architecture and RESTful APIs.',
        accepted: false,
        edited: false,
        timestamp: Date.now()
      });
    }

    // Add version control if missing GitHub
    if (!resumeData.github) {
      enhancements.push({
        id: `github_profile_${Date.now()}`,
        type: 'experience',
        category: 'Profile Enhancement',
        enhancedValue: 'Experience with Git version control system for project collaboration and code management',
        accepted: false,
        edited: false,
        timestamp: Date.now()
      });
    }

    // Add relevant certifications
    enhancements.push({
      id: `certification_${Date.now()}`,
      type: 'certification',
      category: 'Certification Enhancement',
      enhancedValue: 'Oracle Certified Associate, Java SE 8 Programmer',
      accepted: false,
      edited: false,
      timestamp: Date.now()
    });

    return enhancements;
  };

  const calculateFitmentScore = (enhancements: SavedEnhancement[]) => {
    const baseScore = candidate?.fitmentScore || 0;
    const acceptedEnhancements = enhancements.filter(e => e.accepted);
    
    let scoreIncrease = 0;
    acceptedEnhancements.forEach(enhancement => {
      switch (enhancement.type) {
        case 'skill':
          scoreIncrease += 5;
          break;
        case 'project':
          scoreIncrease += 3;
          break;
        case 'certification':
          scoreIncrease += 6;
          break;
        case 'experience':
          scoreIncrease += 4;
          break;
        default:
          scoreIncrease += 2;
      }
    });
    
    return Math.min(baseScore + scoreIncrease, 100);
  };

  const handleEnhancementChange = (enhancementId: string, accepted: boolean, userValue?: string) => {
    // Update enhancement states
    setEnhancementStates(prev => ({
      ...prev,
      [enhancementId]: {
        accepted,
        edited: userValue !== undefined,
        userValue
      }
    }));
    
    // Update saved enhancements
    setSavedEnhancements(prev => 
      prev.map(enhancement => 
        enhancement.id === enhancementId 
          ? {
              ...enhancement,
              accepted,
              edited: userValue !== undefined,
              userEditedValue: userValue
            }
          : enhancement
      )
    );
    
    // Recalculate fitment score
    const updatedEnhancements = savedEnhancements.map(enhancement => 
      enhancement.id === enhancementId 
        ? {
            ...enhancement,
            accepted,
            edited: userValue !== undefined,
            userEditedValue: userValue
          }
        : enhancement
    );
    
    const newScore = calculateFitmentScore(updatedEnhancements);
    setCurrentFitmentScore(newScore);
  };

  const handleTextEdit = (enhancementId: string, newValue: string) => {
    const currentState = enhancementStates[enhancementId] || { accepted: false, edited: false };
    handleEnhancementChange(enhancementId, currentState.accepted, newValue);
  };

  const handleSaveEnhancedResume = () => {
    const success = saveEnhancementsToStorage(savedEnhancements, currentFitmentScore, advancedAnswers);
    
    if (success) {
      setIsResumeEnhanced(true);
      setHasExistingEnhancements(true);
      
      if (onSave && candidate?.id) {
        const enhancedResumeData = createEnhancedResumeData(savedEnhancements);
        onSave(candidate.id, currentFitmentScore, enhancedResumeData);
      }
      
      alert('Enhanced resume saved successfully!');
    } else {
      alert('Error saving enhanced resume. Please try again.');
    }
  };

  const handleDownloadEnhancedResume = () => {
    if (!isResumeEnhanced) return;
    
    const enhancedResumeData = createEnhancedResumeData(savedEnhancements);
    
    let content = `ENHANCED RESUME\n`;
    content += `==================\n\n`;
    content += `Name: ${enhancedResumeData.name}\n`;
    content += `Email: ${enhancedResumeData.email}\n`;
    content += `Contact: ${enhancedResumeData.contact}\n`;
    content += `LinkedIn: ${enhancedResumeData.linkedin}\n`;
    if (enhancedResumeData.github) content += `GitHub: ${enhancedResumeData.github}\n`;
    content += `\n`;
    
    content += `PROFESSIONAL SUMMARY\n`;
    content += `-------\n`;
    content += `${enhancedResumeData.summary}\n\n`;
    
    content += `EDUCATION\n`;
    content += `---------\n`;
    content += `${enhancedResumeData.education}\n\n`;
    
    content += `TECHNICAL SKILLS\n`;
    content += `----------------\n`;
    enhancedResumeData.skills.forEach((skill: string) => {
      content += `• ${skill}\n`;
    });
    content += `\n`;
    
    content += `EXPERIENCE\n`;
    content += `----------\n`;
    enhancedResumeData.experience.forEach((exp: string) => {
      content += `• ${exp}\n`;
    });
    content += `\n`;
    
    content += `PROJECTS\n`;
    content += `--------\n`;
    enhancedResumeData.projects.forEach((project: string) => {
      content += `• ${project}\n`;
    });
    content += `\n`;
    
    content += `ACHIEVEMENTS\n`;
    content += `------------\n`;
    enhancedResumeData.achievements.forEach((achievement: string) => {
      content += `• ${achievement}\n`;
    });
    
    content += `\n\nFITMENT SCORE: ${currentFitmentScore}%\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${enhancedResumeData.name.replace(/\s+/g, '_')}_Enhanced_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetEnhancements = () => {
    if (confirm('Are you sure you want to reset all enhancements? This will remove all your saved changes.')) {
      const saveKey = getSaveKey();
      localStorage.removeItem(saveKey);
      localStorage.removeItem(`enhanced_resume_${candidate?.id}`);
      
      // Reset to fresh enhancements
      const freshEnhancements = generateEnhancements();
      setSavedEnhancements(freshEnhancements);
      setEnhancementStates({});
      setCurrentFitmentScore(candidate?.fitmentScore || 0);
      setIsResumeEnhanced(false);
      setHasExistingEnhancements(false);
      setAdvancedAnswers({});
    }
  };

  const generatePersonalizedQuestions = () => {
    const resumeData = getResumeData();
    const questions = [];
    
    if (!resumeData.github) {
      questions.push({
        id: 'version_control',
        question: 'Do you have experience with version control systems like Git or SVN? Please describe your experience.',
        placeholder: 'e.g., Used Git for personal projects, familiar with branching and merging...'
      });
    }
    
    if (resumeData.projects && resumeData.projects.some((p: string) => p.toLowerCase().includes('web'))) {
      questions.push({
        id: 'web_technologies',
        question: 'What specific web technologies and frameworks have you worked with in your projects?',
        placeholder: 'e.g., React, Node.js, Express, MongoDB, REST APIs...'
      });
    }
    
    if (resumeData.projects && resumeData.projects.some((p: string) => p.toLowerCase().includes('management'))) {
      questions.push({
        id: 'system_design',
        question: 'Can you describe the architecture and design patterns you used in your management system projects?',
        placeholder: 'e.g., MVC pattern, database design, user authentication...'
      });
    }
    
    questions.push({
      id: 'learning_goals',
      question: 'What technologies or skills are you most excited to learn and develop in this role?',
      placeholder: 'e.g., Advanced React concepts, microservices, cloud technologies...'
    });
    
    return questions;
  };

  const handleAdvancedAnswerChange = (questionId: string, answer: string) => {
    setAdvancedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleAdvancedSubmit = () => {
    const success = saveEnhancementsToStorage(savedEnhancements, currentFitmentScore, advancedAnswers);
    
    if (success) {
      alert('Advanced enhancement answers saved! These will be used to provide more personalized suggestions.');
      setActiveTab('quick');
    } else {
      alert('Error saving answers. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 flex items-center space-x-4">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-lg">Loading enhancements...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Wand2 className="w-6 h-6 text-purple-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resume Enhancer</h1>
              <p className="text-gray-600">
                {hasExistingEnhancements ? 'Previously saved enhancements loaded' : 'AI-powered suggestions to improve candidate-JD fitment'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {hasExistingEnhancements && (
              <button
                onClick={handleResetEnhancements}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Reset All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'quick'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Quick Enhancement
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'advanced'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Advanced Enhancement
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'quick' && (
            <div className="h-full flex">
              {/* Left Panel - Original Resume */}
              <div className="w-1/2 border-r border-gray-200 flex flex-col">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Original Resume</h3>
                  <p className="text-sm text-gray-600">Current fitment: {candidate?.fitmentScore || 0}%</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {(() => {
                    const resumeData = getResumeData();
                    return (
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Personal Information</h4>
                          <div className="text-sm text-gray-700 space-y-1">
                            <p><strong>Name:</strong> {resumeData.name}</p>
                            <p><strong>Email:</strong> {resumeData.email}</p>
                            <p><strong>Contact:</strong> {resumeData.contact}</p>
                            <p><strong>LinkedIn:</strong> {resumeData.linkedin}</p>
                            {resumeData.github && <p><strong>GitHub:</strong> {resumeData.github}</p>}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                          <p className="text-sm text-gray-700">{resumeData.summary}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Education</h4>
                          <p className="text-sm text-gray-700">{resumeData.education}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.skills.map((skill: string, index: number) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {resumeData.experience.map((exp: string, index: number) => (
                              <li key={index}>• {exp}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Projects</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {resumeData.projects.map((project: string, index: number) => (
                              <li key={index}>• {project}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Achievements</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {resumeData.achievements.map((achievement: string, index: number) => (
                              <li key={index}>• {achievement}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right Panel - Enhanced Resume */}
              <div className="w-1/2 flex flex-col">
                <div className="p-4 bg-green-50 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Enhanced Resume</h3>
                  <p className="text-sm text-gray-600">Projected fitment: {currentFitmentScore}%</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {savedEnhancements.map((enhancement) => (
                      <div key={enhancement.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 capitalize">
                              {enhancement.type === 'skill' ? `Add ${enhancement.enhancedValue} to Skills` :
                               enhancement.type === 'project' ? 'Enhance Project Description' :
                               enhancement.type === 'certification' ? 'Add Relevant Certification' :
                               enhancement.type === 'experience' ? 'Add Experience Detail' :
                               'Enhancement Suggestion'}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{enhancement.category}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={enhancementStates[enhancement.id]?.accepted || enhancement.accepted}
                              onChange={(e) => handleEnhancementChange(enhancement.id, e.target.checked)}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <label className="text-sm text-gray-700">Accept</label>
                          </div>
                        </div>
                        
                        {enhancement.originalValue && (
                          <div className="mb-3 p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-600 font-medium">Original:</p>
                            <p className="text-sm text-gray-700">{enhancement.originalValue}</p>
                          </div>
                        )}
                        
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 font-medium mb-2">
                            {enhancement.type === 'skill' ? 'Suggested Skill:' : 'Enhanced Version:'}
                          </p>
                          {enhancement.type === 'skill' ? (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                              {enhancementStates[enhancement.id]?.userValue || enhancement.userEditedValue || enhancement.enhancedValue}
                            </span>
                          ) : (
                            <textarea
                              value={enhancementStates[enhancement.id]?.userValue || enhancement.userEditedValue || enhancement.enhancedValue}
                              onChange={(e) => handleTextEdit(enhancement.id, e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                              rows={3}
                              placeholder="Edit the suggestion..."
                            />
                          )}
                        </div>
                        
                        {(enhancementStates[enhancement.id]?.accepted || enhancement.accepted) && (
                          <div className="mt-3 p-3 bg-green-50 rounded">
                            <div className="flex items-center space-x-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-700 font-medium">
                                Enhancement accepted and will be included in your resume
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900">AI Observations</h3>
                      <p className="text-sm text-blue-800 mt-1">
                        Based on your resume analysis, we've identified areas where additional information could significantly improve your fitment score. Please answer the following questions to help us provide more targeted enhancements.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {generatePersonalizedQuestions().map((question, index) => (
                    <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Question {index + 1}: {question.question}
                      </h4>
                      <textarea
                        value={advancedAnswers[question.id] || ''}
                        onChange={(e) => handleAdvancedAnswerChange(question.id, e.target.value)}
                        placeholder={question.placeholder}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={4}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          {activeTab === 'quick' && (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Fitment Score: </span>
                <span className="text-lg font-bold text-blue-600">{currentFitmentScore}%</span>
                <span className="ml-2 text-gray-500">
                  ({savedEnhancements.filter(e => e.accepted).length} enhancements accepted)
                </span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDownloadEnhancedResume}
                  disabled={!isResumeEnhanced}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 relative group ${
                    isResumeEnhanced
                      ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  onMouseEnter={(e) => {
                    if (!isResumeEnhanced) {
                      const tooltip = document.createElement('div');
                      tooltip.className = 'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded whitespace-nowrap z-50';
                      tooltip.textContent = 'First save the enhanced resume';
                      e.currentTarget.appendChild(tooltip);
                    }
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.querySelector('.absolute');
                    if (tooltip) {
                      e.currentTarget.removeChild(tooltip);
                    }
                  }}
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download Enhanced Resume
                </button>
                <button
                  onClick={handleSaveEnhancedResume}
                  className="px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg font-medium hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-sm"
                >
                  Save Enhanced Resume
                </button>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={handleAdvancedSubmit}
                className="px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-lg font-medium hover:from-orange-500 hover:to-pink-600 transition-all duration-200 shadow-sm"
              >
                Submit Answers
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeEnhancer;