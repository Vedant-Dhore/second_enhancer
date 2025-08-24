import React, { useState, useEffect } from 'react';
import { X, Wand2, Check, Edit3, Undo2, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

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

interface Enhancement {
  accepted: boolean;
  rejected: boolean;
  edited: boolean;
  originalText: string;
  editedText: string;
}

interface ProjectEnhancement extends Enhancement {
  hyperlink: string;
}

const ResumeEnhancer: React.FC<ResumeEnhancerProps> = ({ candidate, onSave, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementProgress, setEnhancementProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Enhancement states for each section
  const [summaryEnhancement, setSummaryEnhancement] = useState<Enhancement>({
    accepted: false,
    rejected: false,
    edited: false,
    originalText: '',
    editedText: ''
  });
  
  const [experienceEnhancements, setExperienceEnhancements] = useState<Enhancement[]>([]);
  const [projectEnhancements, setProjectEnhancements] = useState<ProjectEnhancement[]>([]);
  const [skillsEnhancement, setSkillsEnhancement] = useState<Enhancement>({
    accepted: false,
    rejected: false,
    edited: false,
    originalText: '',
    editedText: ''
  });
  const [achievementsEnhancements, setAchievementsEnhancements] = useState<Enhancement[]>([]);

  // Get resume data based on candidate
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
          "Developed web applications using modern frameworks",
          "Created responsive user interfaces"
        ],
        skills: ["JavaScript", "React", "Node.js"],
        projects: [
          "E-commerce Website - Full-stack development with responsive design",
          "Task Management App - React application with state management"
        ],
        achievements: [
          "Dean's List for academic excellence",
          "Winner of coding competition"
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

  // Initialize enhancement states
  useEffect(() => {
    // Initialize experience enhancements
    setExperienceEnhancements(resumeData.experience.map(() => ({
      accepted: false,
      rejected: false,
      edited: false,
      originalText: '',
      editedText: ''
    })));

    // Initialize project enhancements
    setProjectEnhancements(resumeData.projects.map(() => ({
      accepted: false,
      rejected: false,
      edited: false,
      originalText: '',
      editedText: '',
      hyperlink: ''
    })));

    // Initialize achievements enhancements
    setAchievementsEnhancements(resumeData.achievements.map(() => ({
      accepted: false,
      rejected: false,
      edited: false,
      originalText: '',
      editedText: ''
    })));
  }, [candidate]);

  const enhancementSteps = [
    { title: 'Summary', description: 'Enhance professional summary' },
    { title: 'Experience', description: 'Improve work experience descriptions' },
    { title: 'Projects', description: 'Enhance project descriptions' },
    { title: 'Skills', description: 'Optimize skills section' },
    { title: 'Achievements', description: 'Highlight key achievements' }
  ];

  const getEnhancedSummary = () => {
    const jobRequiredSkills = ['Java', 'React', 'SQL', 'JavaScript', 'Python'];
    const candidateSkills = resumeData.skills;
    const missingSkills = jobRequiredSkills.filter(skill => !candidateSkills.includes(skill));
    
    return `Passionate Computer Science student with hands-on experience in full-stack web development and database management. Proficient in ${candidateSkills.join(', ')} with demonstrated ability to build scalable applications. Strong problem-solving skills and eager to contribute to innovative software solutions in an internship role. Quick learner with excellent collaboration abilities and a track record of academic excellence.${missingSkills.length > 0 ? ` Currently expanding expertise in ${missingSkills.slice(0, 2).join(' and ')}.` : ''}`;
  };

  const getEnhancedExperience = (index: number) => {
    const enhancements = [
      "Architected and developed a comprehensive Blood Bank Management System using Java and MySQL, implementing CRUD operations, user authentication, and inventory tracking features that improved blood donation workflow efficiency by 40%",
      "Designed and implemented responsive web interfaces using HTML5, CSS3, and JavaScript ES6, ensuring cross-browser compatibility and mobile-first approach, resulting in enhanced user experience across multiple devices"
    ];
    return enhancements[index] || resumeData.experience[index];
  };

  const getEnhancedProject = (index: number) => {
    const enhancements = [
      "Blood Bank Management System - Comprehensive Java application featuring MySQL database integration, user role management, real-time inventory tracking, and automated notification system for critical blood type shortages",
      "E-commerce Website - Modern responsive web application built with HTML5, CSS3, and JavaScript, featuring product catalog, shopping cart functionality, user authentication, and payment gateway integration"
    ];
    return enhancements[index] || resumeData.projects[index];
  };

  const getEnhancedSkills = () => {
    const currentSkills = resumeData.skills;
    const additionalSkills = ['Git', 'REST APIs', 'Database Design'];
    const enhancedSkills = [...currentSkills, ...additionalSkills.filter(skill => !currentSkills.includes(skill))];
    return enhancedSkills;
  };

  const getEnhancedAchievement = (index: number) => {
    const enhancements = [
      "Maintained Dean's List status for 2 consecutive semesters with GPA above 3.8, demonstrating consistent academic excellence and strong time management skills",
      "Winner of College Technical Fest 2023 - Led team of 4 developers to create innovative web application, showcasing leadership and technical expertise in competitive environment"
    ];
    return enhancements[index] || resumeData.achievements[index];
  };

  const startEnhancement = () => {
    setIsEnhancing(true);
    setEnhancementProgress(0);
    
    const interval = setInterval(() => {
      setEnhancementProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsEnhancing(false);
          setShowResults(true);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const handleSectionAction = (section: string, index: number, action: 'accept' | 'reject' | 'edit', editedText?: string) => {
    switch (section) {
      case 'summary':
        setSummaryEnhancement(prev => ({
          ...prev,
          accepted: action === 'accept',
          rejected: action === 'reject',
          edited: action === 'edit',
          editedText: editedText || prev.editedText
        }));
        break;
      case 'experience':
        setExperienceEnhancements(prev => prev.map((item, i) => 
          i === index ? {
            ...item,
            accepted: action === 'accept',
            rejected: action === 'reject',
            edited: action === 'edit',
            editedText: editedText || item.editedText
          } : item
        ));
        break;
      case 'projects':
        setProjectEnhancements(prev => prev.map((item, i) => 
          i === index ? {
            ...item,
            accepted: action === 'accept',
            rejected: action === 'reject',
            edited: action === 'edit',
            editedText: editedText || item.editedText
          } : item
        ));
        break;
      case 'skills':
        setSkillsEnhancement(prev => ({
          ...prev,
          accepted: action === 'accept',
          rejected: action === 'reject',
          edited: action === 'edit',
          editedText: editedText || prev.editedText
        }));
        break;
      case 'achievements':
        setAchievementsEnhancements(prev => prev.map((item, i) => 
          i === index ? {
            ...item,
            accepted: action === 'accept',
            rejected: action === 'reject',
            edited: action === 'edit',
            editedText: editedText || item.editedText
          } : item
        ));
        break;
    }
  };

  const handleProjectHyperlinkChange = (index: number, hyperlink: string) => {
    setProjectEnhancements(prev => prev.map((item, i) => 
      i === index ? { ...item, hyperlink } : item
    ));
  };

  const handleUndo = (section: string, index: number) => {
    switch (section) {
      case 'summary':
        setSummaryEnhancement(prev => ({
          ...prev,
          accepted: false,
          rejected: false,
          edited: false,
          editedText: ''
        }));
        break;
      case 'experience':
        setExperienceEnhancements(prev => prev.map((item, i) => 
          i === index ? {
            ...item,
            accepted: false,
            rejected: false,
            edited: false,
            editedText: ''
          } : item
        ));
        break;
      case 'projects':
        setProjectEnhancements(prev => prev.map((item, i) => 
          i === index ? {
            ...item,
            accepted: false,
            rejected: false,
            edited: false,
            editedText: ''
          } : item
        ));
        break;
      case 'skills':
        setSkillsEnhancement(prev => ({
          ...prev,
          accepted: false,
          rejected: false,
          edited: false,
          editedText: ''
        }));
        break;
      case 'achievements':
        setAchievementsEnhancements(prev => prev.map((item, i) => 
          i === index ? {
            ...item,
            accepted: false,
            rejected: false,
            edited: false,
            editedText: ''
          } : item
        ));
        break;
    }
  };

  const calculateNewFitmentScore = () => {
    let baseScore = candidate?.fitmentScore || 65;
    let improvements = 0;
    
    if (summaryEnhancement.accepted || summaryEnhancement.edited) improvements += 5;
    improvements += experienceEnhancements.filter(e => e.accepted || e.edited).length * 3;
    improvements += projectEnhancements.filter(e => e.accepted || e.edited).length * 4;
    if (skillsEnhancement.accepted || skillsEnhancement.edited) improvements += 8;
    improvements += achievementsEnhancements.filter(e => e.accepted || e.edited).length * 2;
    
    return Math.min(baseScore + improvements, 95);
  };

  const handleSave = () => {
    const newScore = calculateNewFitmentScore();
    const enhancedSkills = skillsEnhancement.accepted || skillsEnhancement.edited 
      ? getEnhancedSkills() 
      : resumeData.skills;
    
    const enhancedResume = {
      ...resumeData,
      summary: summaryEnhancement.accepted 
        ? getEnhancedSummary() 
        : summaryEnhancement.edited 
          ? summaryEnhancement.editedText 
          : resumeData.summary,
      experience: resumeData.experience.map((exp: string, index: number) => {
        const enhancement = experienceEnhancements[index];
        if (enhancement?.accepted) return getEnhancedExperience(index);
        if (enhancement?.edited) return enhancement.editedText;
        return exp;
      }),
      projects: resumeData.projects.map((project: string, index: number) => {
        const enhancement = projectEnhancements[index];
        if (enhancement?.accepted) return getEnhancedProject(index);
        if (enhancement?.edited) return enhancement.editedText;
        return project;
      }),
      skills: enhancedSkills,
      achievements: resumeData.achievements.map((achievement: string, index: number) => {
        const enhancement = achievementsEnhancements[index];
        if (enhancement?.accepted) return getEnhancedAchievement(index);
        if (enhancement?.edited) return enhancement.editedText;
        return achievement;
      })
    };
    
    if (candidate && onSave) {
      onSave(candidate.id, newScore, enhancedResume);
    }
    
    onClose();
  };

  const EnhancementSection: React.FC<{
    title: string;
    originalContent: string | string[];
    enhancedContent: string | string[];
    section: string;
    index?: number;
  }> = ({ title, originalContent, enhancedContent, section, index = 0 }) => {
    const getEnhancement = () => {
      switch (section) {
        case 'summary': return summaryEnhancement;
        case 'experience': return experienceEnhancements[index];
        case 'projects': return projectEnhancements[index];
        case 'skills': return skillsEnhancement;
        case 'achievements': return achievementsEnhancements[index];
        default: return { accepted: false, rejected: false, edited: false, originalText: '', editedText: '' };
      }
    };

    const enhancement = getEnhancement();
    const isArray = Array.isArray(originalContent);
    const original = isArray ? originalContent[index] : originalContent;
    const enhanced = isArray ? (enhancedContent as string[])[index] : enhancedContent;

    return (
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Original Content */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Original</h5>
            <div className="bg-gray-50 p-3 rounded border text-sm text-gray-700">
              {section === 'skills' && Array.isArray(original) ? (
                <div className="flex flex-wrap gap-2">
                  {(original as string[]).map((skill, i) => (
                    <span key={i} className="bg-gray-200 px-2 py-1 rounded text-xs">{skill}</span>
                  ))}
                </div>
              ) : (
                <p>{original as string}</p>
              )}
            </div>
          </div>

          {/* Enhanced Content */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Enhanced</h5>
            <div className="space-y-3">
              <textarea
                value={enhancement.edited ? enhancement.editedText : enhanced as string}
                onChange={(e) => handleSectionAction(section, index, 'edit', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded text-sm resize-none"
                rows={section === 'skills' ? 3 : 4}
                placeholder="Enhanced content will appear here..."
              />
              
              {/* Project Hyperlink Input - Only for projects section */}
              {section === 'projects' && (
                <input
                  type="url"
                  value={projectEnhancements[index]?.hyperlink || ''}
                  onChange={(e) => handleProjectHyperlinkChange(index, e.target.value)}
                  placeholder="Enter project hyperlink (e.g., GitHub or Live Demo URL)"
                  className="w-full p-3 border border-gray-300 rounded text-sm"
                />
              )}
              
              <div className="flex space-x-2">
                {!enhancement.accepted && !enhancement.rejected && !enhancement.edited && (
                  <>
                    <button
                      onClick={() => handleSectionAction(section, index, 'accept')}
                      className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleSectionAction(section, index, 'reject')}
                      className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleSectionAction(section, index, 'edit', enhanced as string)}
                      className="flex items-center space-x-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  </>
                )}
                
                {(enhancement.accepted || enhancement.rejected || enhancement.edited) && (
                  <button
                    onClick={() => handleUndo(section, index)}
                    className="flex items-center space-x-1 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                  >
                    <Undo2 className="w-3 h-3" />
                    <span>Undo</span>
                  </button>
                )}
              </div>
              
              {enhancement.accepted && (
                <div className="text-green-600 text-sm font-medium">✓ Accepted</div>
              )}
              {enhancement.rejected && (
                <div className="text-red-600 text-sm font-medium">✗ Rejected</div>
              )}
              {enhancement.edited && (
                <div className="text-blue-600 text-sm font-medium">✓ Edited</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!showResults) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Resume Enhancer</h1>
                <p className="text-sm text-gray-600">AI-powered resume optimization</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            {!isEnhancing ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to enhance {candidate?.name || 'the candidate'}'s resume?
                </h2>
                <p className="text-gray-600 mb-6">
                  Our AI will analyze and suggest improvements to increase job fitment score from {candidate?.fitmentScore || 65}% to an estimated {calculateNewFitmentScore()}%.
                </p>
                
                <div className="space-y-3 mb-6">
                  {enhancementSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{step.title}</div>
                        <div className="text-sm text-gray-600">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={startEnhancement}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-sm"
                >
                  Start Enhancement Process
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wand2 className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Enhancing Resume...
                </h2>
                <p className="text-gray-600 mb-6">
                  AI is analyzing and optimizing resume content
                </p>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-100"
                    style={{ width: `${enhancementProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">{enhancementProgress}% Complete</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <Wand2 className="w-6 h-6 text-purple-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Quick Enhancement</h1>
                <p className="text-sm text-gray-600">{candidate?.name || 'Sample Candidate'} • Fitment Score: {candidate?.fitmentScore || 65}% → {calculateNewFitmentScore()}%</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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

        <div className="p-6">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-6 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{resumeData.name}</h2>
                <p className="text-sm text-gray-600">{resumeData.email} • {resumeData.contact}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{calculateNewFitmentScore()}%</div>
                <div className="text-sm text-gray-600">Projected Fitment</div>
              </div>
            </div>
          </div>

          {/* Enhancement Sections */}
          <div className="space-y-6">
            {/* Summary */}
            <EnhancementSection
              title="Professional Summary"
              originalContent={resumeData.summary}
              enhancedContent={getEnhancedSummary()}
              section="summary"
            />

            {/* Experience */}
            {resumeData.experience.map((exp: string, index: number) => (
              <EnhancementSection
                key={`exp-${index}`}
                title={`Experience ${index + 1}`}
                originalContent={resumeData.experience}
                enhancedContent={resumeData.experience.map((_: string, i: number) => getEnhancedExperience(i))}
                section="experience"
                index={index}
              />
            ))}

            {/* Projects */}
            {resumeData.projects.map((project: string, index: number) => (
              <EnhancementSection
                key={`proj-${index}`}
                title={`Project ${index + 1}`}
                originalContent={resumeData.projects}
                enhancedContent={resumeData.projects.map((_: string, i: number) => getEnhancedProject(i))}
                section="projects"
                index={index}
              />
            ))}

            {/* Skills */}
            <EnhancementSection
              title="Technical Skills"
              originalContent={resumeData.skills}
              enhancedContent={getEnhancedSkills().join(', ')}
              section="skills"
            />

            {/* Achievements */}
            {resumeData.achievements.map((achievement: string, index: number) => (
              <EnhancementSection
                key={`ach-${index}`}
                title={`Achievement ${index + 1}`}
                originalContent={resumeData.achievements}
                enhancedContent={resumeData.achievements.map((_: string, i: number) => getEnhancedAchievement(i))}
                section="achievements"
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEnhancer;